// deno-lint-ignore-file
import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { detectLocale } from '../translation.ts';
import { TranslationProvider } from '../../components/shared/TranslationContext.tsx';
import Wrapper from '../../components/shared/Layout.tsx';
import { BaseTestConfig } from '../../@types/test.ts';
import { TestAssertions } from './Assertions.ts';
import { MockFactory } from './MockFactory.ts';
import { Locale } from '../../@types/translation.ts';

export interface ReactTestConfig extends BaseTestConfig {
  serverSide?: boolean;
  withLayout?: boolean;
  customProviders?: React.ComponentType<{ children?: React.ReactNode }>[];
}

// Augment globalThis to include __TEST_HOOKS__
declare global {
  // eslint-disable-next-line no-var
  var __TEST_HOOKS__: Record<string, (...args: any[]) => any> | undefined;
}

export class ReactTestUtils {
  private config: ReactTestConfig;
  private TestProvider: React.ComponentType<{ children: React.ReactNode }>;

  constructor(config: ReactTestConfig = {}) {
    this.config = {
      locale: 'fr',
      serverSide: typeof window === 'undefined',
      withLayout: true,
      timeout: 5000,
      ...config
    };

    this.TestProvider = this.createTestProvider();
  }

  private createTestProvider(): React.ComponentType<{ children: React.ReactNode }> {
    const { locale = detectLocale(), serverSide = false, withLayout = true, customProviders = [] } = this.config;

    return ({ children }) => {
      let content = children;

      // Wrapper avec layout si demandé
      if (withLayout) {
        content = React.createElement(Wrapper, {}, content);
      }

      // Wrapper avec les providers personnalisés
      customProviders.reverse().forEach(Provider => {
        content = React.createElement(Provider, {}, content);
      });

      // Wrapper avec le provider de traduction
      return React.createElement(
        TranslationProvider,
        { initialLocale: locale as Locale, serverSide },
        content
      );
    };
  }

  /**
   * Render un composant avec tous les providers configurés
   */
  render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
    const result = render(ui, { 
      wrapper: this.TestProvider, 
      ...options 
    });

    return {
      ...result,
      user: userEvent.setup()
    };
  }

  /**
   * Test des props par défaut d'un composant
   */
  async testDefaultProps(
    Component: React.ComponentType<any>,
    expectedTexts: string[],
    props: any = {}
  ): Promise<void> {
    this.render(React.createElement(Component, props));
    
    await Promise.all(
      expectedTexts.map(async text => {
        const element = await screen.findByText(text);
        TestAssertions.assertTrue(
          element !== null,
          `Expected to find text: "${text}"`
        );
      })
    );
  }

  /**
   * Test des interactions utilisateur
   */
  async testUserInteraction<P extends object>(
    Component: React.ComponentType<P>,
    props: P,
    interaction: (user: ReturnType<typeof userEvent.setup>) => Promise<void>,
    assertions: () => void | Promise<void>
  ): Promise<void> {
    const { user } = this.render(React.createElement(Component, props));
    
    await interaction(user);
    await assertions();
  }

  /**
   * Test du rendu conditionnel
   */
  testConditionalRender<P extends object>(
    Component: React.ComponentType<P>,
    scenarios: Array<{
      props: P;
      shouldRender: string[];
      shouldNotRender: string[];
      description?: string;
    }>
  ): void {
    scenarios.forEach(({ props, shouldRender, shouldNotRender, description }) => {
      // Cleanup du rendu précédent
      cleanup();
      
      this.render(React.createElement(Component, props));
      
      shouldRender.forEach(text => {
        const element = screen.queryByText(text);
        TestAssertions.assertTrue(
          element !== null,
          `${description || ''} - Expected to find: "${text}"`
        );
      });
      
      shouldNotRender.forEach(text => {
        const element = screen.queryByText(text);
        TestAssertions.assertTrue(
          element === null,
          `${description || ''} - Expected NOT to find: "${text}"`
        );
      });
    });
  }

  /**
   * Mock d'un hook personnalisé
   */
  mockCustomHook<T>(hookName: string, mockValue: T): void {
    // Pour Deno, on peut utiliser l'import map ou un registre global
    globalThis.__TEST_HOOKS__ = globalThis.__TEST_HOOKS__ || {};
    globalThis.__TEST_HOOKS__[hookName] = () => mockValue;
  }

  /**
   * Test d'accessibilité basique
   */
  async testAccessibility(ui: ReactElement): Promise<void> {
    const { container } = this.render(ui);
    
    // Vérification des rôles ARIA
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      TestAssertions.assertTrue(
        button.hasAttribute('type') || button.getAttribute('role') === 'button',
        'Buttons should have type or role attribute'
      );
    });

    // Vérification des labels
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      const hasLabel = input.hasAttribute('aria-label') || 
                      input.hasAttribute('aria-labelledby') ||
                      !!container.querySelector(`label[for="${input.id}"]`);
      
      TestAssertions.assertTrue(
        hasLabel,
        'Input elements should have associated labels'
      );
    });
  }

  /**
   * Nettoyage après les tests
   */
  cleanup(): void {
    cleanup();
    MockFactory.resetAll();
  }

  /**
   * Configuration du mock pour fetch global
   */
  mockFetch(responses: Record<string, any>): void {
    const mockFetch = MockFactory.createMock<typeof fetch>('fetch');
    
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const method = init?.method || 'GET';
      const key = `${method} ${url}`;
      
      if (responses[key]) {
        return new Response(JSON.stringify(responses[key]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404 });
    };
  }
}