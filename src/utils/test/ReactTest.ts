/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	cleanup,
	render,
	type RenderOptions,
	screen,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React, { type ReactElement } from 'react';
import type { BaseTestConfig } from '../../@types/test';
import Wrapper from '../../components/dashboard/Wrapper';
import { TranslationProvider } from '../../components/shared/TranslationContext';
import { detectLocale } from '../translation';
import { TestAssertions } from './Assertions';
import { MockFactory } from './MockFactory';

declare global {
	interface Window {
		__TEST_HOOKS__: {
			[key: string]: () => any;
		};
	}
}

export interface ReactTestConfig extends BaseTestConfig {
	serverSide?: boolean;
	withLayout?: boolean;
	customProviders?: React.ComponentType<{ children?: React.ReactNode }>[];
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
	}

	private createTestProvider(): React.ComponentType<{
		children: React.ReactNode;
	}> {
		const {
			locale = detectLocale(),
			serverSide = false,
			withLayout = true,
			customProviders = [],
		} = this.config;

		const TestProvider: React.FC<{ children: React.ReactNode }> = ({
			children,
		}) => {
			let content = children;

			// Wrapper avec layout si demandé
			if (withLayout) {
				content = React.createElement(Wrapper, {}, content);
			}

			// Wrapper avec les providers personnalisés
			customProviders
				.slice()
				.reverse()
				.forEach((Provider) => {
					content = React.createElement(Provider, {}, content);
				});

			// Wrapper avec le provider de traduction
			return React.createElement(
				TranslationProvider,
				{ initialLocale: locale as any, serverSide },
				content,
			);
		};
		TestProvider.displayName = 'TestProvider';
		return TestProvider;
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
		window.__TEST_HOOKS__ = window.__TEST_HOOKS__ || {};
		window.__TEST_HOOKS__[hookName] = () => mockValue;
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
			const hasLabel =
				input.hasAttribute('aria-label') ||
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
		// const mockFetch = MockFactory.createMock<typeof fetch>('fetch')

		const mockFetchFn = async (
			input: RequestInfo | URL,
			init?: RequestInit,
		) => {
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
		// Add the missing 'preconnect' property to match Bun's fetch type
		(mockFetchFn as typeof fetch).preconnect = () => {
			// No-op for test environment
			return Promise.resolve();
		};
		globalThis.fetch = mockFetchFn as typeof fetch;
	}
}
