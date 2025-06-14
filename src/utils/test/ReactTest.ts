// deno-lint-ignore-file
import React, { ReactElement } from 'react';
import { cleanup, render, RenderOptions, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { detectLocale } from '../translation.ts';
import { TranslationProvider } from '../../components/shared/TranslationContext.tsx';
import Wrapper from '../../components/shared/Layout.tsx';
import { BaseTestConfig } from '../../@types/test.ts';
import { TestAssertions } from './Assertions.ts';
import { MockFactory } from './MockFactory.ts';
import { Locale } from '../../@types/translation.ts';
import { JSDOM } from 'jsdom';

const setupDom = () => {
  const dom = new JSDOM();

  // Expose JSDOM globals to the Deno global scope
  globalThis.window = dom.window as unknown as typeof globalThis.window;
  globalThis.document = dom.window.document;
  globalThis.navigator = dom.window.navigator;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.customElements = dom.window.customElements;
  globalThis.Event = dom.window.Event;
  globalThis.Node = dom.window.Node;
  globalThis.SVGElement = dom.window.SVGElement;
  globalThis.localStorage = dom.window.localStorage;
  globalThis.sessionStorage = dom.window.sessionStorage;
  globalThis.location = dom.window.location; // Crucial for some libraries
  globalThis.history = dom.window.history; // Crucial for some libraries
  globalThis.screen = dom.window.screen; // Might be needed
  globalThis.URL = dom.window.URL; // Important for URL operations
  globalThis.Blob = dom.window.Blob; // Important for file handling
  globalThis.File = dom.window.File;
  globalThis.FileReader = dom.window.FileReader;
  globalThis.TextEncoder = dom.window.TextEncoder;
  globalThis.TextDecoder = dom.window.TextDecoder;
  globalThis.MutationObserver = dom.window.MutationObserver;
  globalThis.CustomEvent = dom.window.CustomEvent;

  // Mock requestAnimationFrame for React
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(callback, 0);
  };
  globalThis.cancelAnimationFrame = (handle: number) => {
    clearTimeout(handle);
  };

  // Optionally, if you have specific global properties your app needs
  // Object.defineProperty(globalThis, 'someGlobalProp', { value: 'someValue' });

  // Add this to catch any unhandled promise rejections within JSDOM
  dom.window.addEventListener('unhandledrejection', (event) => {
    console.error('JSDOM Unhandled Promise Rejection:', event.reason);
  });
  dom.window.addEventListener('error', (event) => {
    console.error('JSDOM Error:', event.error);
  });
};

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
      ...config,
    };

    this.TestProvider = this.createTestProvider();
    setupDom();
  }

  private createTestProvider(): React.ComponentType<
    { children: React.ReactNode }
  > {
    const {
      locale = detectLocale(),
      serverSide = false,
      withLayout = true,
      customProviders = [],
    } = this.config;

    return ({ children }) => {
      let content = children;

      // Wrapper avec layout si demandé
      if (withLayout) {
        content = React.createElement(Wrapper, {}, content);
      }

      // Wrapper avec les providers personnalisés
      customProviders.reverse().forEach((Provider) => {
        content = React.createElement(Provider, {}, content);
      });

      // Wrapper avec le provider de traduction
      return React.createElement(
        TranslationProvider,
        { initialLocale: locale as Locale, serverSide },
        content,
      );
    };
  }

  /**
   * Render un composant avec tous les providers configurés
   */
  render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
    const result = render(ui, {
      wrapper: this.TestProvider,
      ...options,
    });

    return {
      ...result,
      user: userEvent.setup(),
    };
  }

  /**
   * Test des props par défaut d'un composant
   */
  async testDefaultProps(
    Component: React.ComponentType<any>,
    expectedTexts: string[],
    props: any = {},
  ): Promise<void> {
    this.render(React.createElement(Component, props));

    await Promise.all(
      expectedTexts.map(async (text) => {
        const element = await screen.findByText(text);
        TestAssertions.assertTrue(
          element !== null,
          `Expected to find text: "${text}"`,
        );
      }),
    );
  }

  /**
   * Test des interactions utilisateur
   */
  async testUserInteraction<P extends object>(
    Component: React.ComponentType<P>,
    props: P,
    interaction: (user: ReturnType<typeof userEvent.setup>) => Promise<void>,
    assertions: () => void | Promise<void>,
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
    }>,
  ): void {
    scenarios.forEach(
      ({ props, shouldRender, shouldNotRender, description }) => {
        // Cleanup du rendu précédent
        cleanup();

        this.render(React.createElement(Component, props));

        shouldRender.forEach((text) => {
          const element = screen.queryByText(text);
          TestAssertions.assertTrue(
            element !== null,
            `${description || ''} - Expected to find: "${text}"`,
          );
        });

        shouldNotRender.forEach((text) => {
          const element = screen.queryByText(text);
          TestAssertions.assertTrue(
            element === null,
            `${description || ''} - Expected NOT to find: "${text}"`,
          );
        });
      },
    );
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
    buttons.forEach((button) => {
      TestAssertions.assertTrue(
        button.hasAttribute('type') || button.getAttribute('role') === 'button',
        'Buttons should have type or role attribute',
      );
    });

    // Vérification des labels
    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      const hasLabel = input.hasAttribute('aria-label') ||
        input.hasAttribute('aria-labelledby') ||
        !!container.querySelector(`label[for="${input.id}"]`);

      TestAssertions.assertTrue(
        hasLabel,
        'Input elements should have associated labels',
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
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response('Not Found', { status: 404 });
    };
  }
}
