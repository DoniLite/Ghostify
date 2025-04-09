import { FC, PropsWithChildren, render } from 'npm:hono/jsx/dom';
import { JSX } from 'npm:hono/jsx/jsx-runtime';

type RouteParams = Record<string, string>;
type QueryParams = Record<string, string>;

export type RouteComponent = FC<
  PropsWithChildren<{
    params?: RouteParams;
    query?: QueryParams;
  }>
>;

type RouteDefinition = {
  pattern: RegExp;
  component: RouteComponent;
  layout?: RouteComponent;
};

type RouteCache = {
  element: JSX.Element;
  timestamp: number;
  ttl: number;
};

type RouterOptions = {
  cache?: boolean;
  cacheTTL?: number;
  baseLink?: string;
  rootElement?: string | HTMLElement;
  defaultLayout?: RouteComponent;
  notFoundComponent?: RouteComponent;
};

export class HonoClientRouter {
  private routes: Map<string, RouteDefinition> = new Map();
  private cache: Map<string, RouteCache> = new Map();
  private options: RouterOptions = {
    cache: true,
    cacheTTL: 60000,
    baseLink: '',
    rootElement: '#app',
    notFoundComponent: () => <div>Page not found</div>,
  };
  private currentPath: string = '';
  private rootElement: HTMLElement | null = null;

  constructor(options?: RouterOptions) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Convertit un chemin de route en expression régulière
   */
  private pathToRegex(path: string): RegExp {
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:([^\/]+)/g, '([^\\/]+)');
    return new RegExp(`^${pattern}$`);
  }

  /**
   * Extrait les paramètres de route d'une URL
   */
  private extractParams(path: string, match: RegExpMatchArray): RouteParams {
    const paramNames = [...path.matchAll(/:([^\/]+)/g)].map((m) => m[1]);
    const values = match.slice(1);

    return paramNames.reduce((params, name, i) => {
      params[name] = values[i];
      return params;
    }, {} as RouteParams);
  }

  /**
   * Extrait les paramètres de requête d'une URL
   */
  private extractQueryParams(search: string): QueryParams {
    const params: QueryParams = {};
    new URLSearchParams(search).forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  /**
   * Enregistre une route avec son composant JSX
   */
  route(
    path: string,
    component: RouteComponent,
    layout?: RouteComponent
  ): HonoClientRouter {
    this.routes.set(path, {
      pattern: this.pathToRegex(path),
      component,
      layout,
    });
    return this;
  }

  /**
   * Définit un layout par défaut pour toutes les routes
   */
  setDefaultLayout(layout: RouteComponent): HonoClientRouter {
    this.options.defaultLayout = layout;
    return this;
  }

  /**
   * Définit un composant pour les routes non trouvées
   */
  setNotFound(component: RouteComponent): HonoClientRouter {
    this.options.notFoundComponent = component;
    return this;
  }

  /**
   * Navigation programmatique
   */
  navigate(path: string, pushState: boolean = true): void {
    // Ajouter le baseLink si nécessaire
    const fullPath =
      this.options.baseLink && !path.startsWith(this.options.baseLink)
        ? `${this.options.baseLink}${path === '/' ? '' : path}`
        : path;

    if (pushState) {
      globalThis.history.pushState(null, '', fullPath);
    }
    this.handleRouteChange();
  }

  /**
   * Intercepter les clics sur les liens
   */
  private enhanceLinks(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (
        link &&
        link.href &&
        // link.href.startsWith(globalThis.location.origin) &&
        !link.getAttribute('target') &&
        !link.hasAttribute('data-no-router') &&
        !(e.ctrlKey || e.metaKey || e.shiftKey)
      ) {
        e.preventDefault();
        this.navigate(link.href.replace(globalThis.location.origin, ''));
      }
    });
  }

  /**
   * Traite le changement de route
   */
  private handleRouteChange(): void {
    let path = globalThis.location.pathname;
    const search = globalThis.location.search;
    const query = this.extractQueryParams(search);

    // Gérer le baseLink
    if (this.options.baseLink && path.startsWith(this.options.baseLink)) {
      path = path.substring(this.options.baseLink.length) || '/';
    }

    this.currentPath = path;

    // Recherche d'une route correspondante
    for (const [routePath, routeDef] of this.routes.entries()) {
      const match = path.match(routeDef.pattern);

      if (match) {
        const params = this.extractParams(routePath, match);
        const cacheKey = `${routePath}:${JSON.stringify(
          params
        )}:${JSON.stringify(query)}`;

        // Vérifier le cache
        let element: JSX.Element;
        if (this.options.cache) {
          const cached = this.cache.get(cacheKey);
          if (cached && Date.now() - cached.timestamp < cached.ttl) {
            element = cached.element;
          } else {
            element = this.renderRouteComponent(routeDef, params, query);

            // Mettre en cache
            this.cache.set(cacheKey, {
              element,
              timestamp: Date.now(),
              ttl: this.options.cacheTTL || 60000,
            });
          }
        } else {
          element = this.renderRouteComponent(routeDef, params, query);
        }

        // Rendre le composant
        if (this.rootElement) {
          render(element, this.rootElement);
        }

        return;
      }
    }

    // Aucune route trouvée
    if (this.rootElement && this.options.notFoundComponent) {
      const NotFound = this.options.notFoundComponent;
      render(<NotFound params={{}} query={query} />, this.rootElement);
    }
  }

  /**
   * Prépare le rendu d'un composant de route avec son layout
   */
  private renderRouteComponent(
    routeDef: RouteDefinition,
    params: RouteParams,
    query: QueryParams
  ): JSX.Element {
    const RouteComponent = routeDef.component;
    const content = <RouteComponent params={params} query={query} />;

    // Appliquer le layout spécifique à la route ou le layout par défaut
    if (routeDef.layout) {
      const Layout = routeDef.layout;
      return (
        <Layout params={params} query={query}>
          {content}
        </Layout>
      );
    } else if (this.options.defaultLayout) {
      const DefaultLayout = this.options.defaultLayout;
      return (
        <DefaultLayout params={params} query={query}>
          {content}
        </DefaultLayout>
      );
    }

    return content;
  }

  /**
   * Force la revalidation du cache
   */
  revalidate(path?: string): void {
    if (path) {
      for (const [key] of this.cache.entries()) {
        if (key.startsWith(path)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }

    this.handleRouteChange();
  }

  /**
   * Crée un composant Link pour la navigation
   */
  Link = ({
    to,
    children,
    ...props
  }: PropsWithChildren<
    Record<string, unknown> & {
      to: string;
    }
  >) => {
    const href =
      this.options.baseLink && to !== '/'
        ? `${this.options.baseLink}${to}`
        : to === '/' && this.options.baseLink
        ? this.options.baseLink
        : to;

    const handleClick = <T extends MouseEvent>(e: T) => {
      if (!(e.ctrlKey || e.metaKey || e.shiftKey)) {
        e.preventDefault();
        this.navigate(to);
      }
    };

    return (
      <a href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  };

  /**
   * Initialise le routeur
   */
  init(): HonoClientRouter {
    // Trouver l'élément racine
    if (typeof this.options.rootElement === 'string') {
      this.rootElement = document.querySelector(this.options.rootElement);
    } else if (this.options.rootElement instanceof HTMLElement) {
      this.rootElement = this.options.rootElement;
    }

    if (!this.rootElement) {
      console.error('Root element not found');
      return this;
    }

    // Écouteurs d'événements
    globalThis.addEventListener('popstate', () => this.handleRouteChange());

    this.enhanceLinks();

    // Route initiale
    this.handleRouteChange();

    return this;
  }
}

// Composant Layout par défaut qui prend en charge les enfants
export const DefaultLayout: FC = ({ children }) => (
  <div className='layout'>{children}</div>
);
