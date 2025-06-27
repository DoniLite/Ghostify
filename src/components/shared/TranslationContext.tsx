import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react';
import {
	getDeepValue,
	type Locale,
	type TranslationKeys,
	translations,
} from '../../@types/translation';

export interface TranslationContextType {
	/**
	 * The current local
	 */
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: <T extends TranslationKeys>(
		key: T,
		variables?: Record<string, string | number>,
	) => string;
	availableLocales: Locale[];
}

export const TranslationContext = createContext<TranslationContextType | null>(
	null,
);

export interface I18nProviderProps {
	children?: ReactNode;
	initialLocale: Locale;
	serverSide?: boolean;
}

export function TranslationProvider({
	children,
	initialLocale,
	serverSide = false,
}: I18nProviderProps) {
	const [locale, setLocaleState] = useState<Locale>(initialLocale);

	const setLocale = useCallback(
		(newLocale: Locale) => {
			setLocaleState(newLocale);

			// Côté client seulement
			if (!serverSide && typeof window !== 'undefined') {
				localStorage.setItem('preferred-locale', newLocale);

				const url = new URL(globalThis.location.href);
				url.searchParams.set('lang', newLocale);
				globalThis.history.replaceState({}, '', url.toString());
			}
		},
		[serverSide],
	);

	const t = useCallback(
		(
			key: TranslationKeys,
			variables?: Record<string, string | number>,
		): string => {
			try {
				const translation = getDeepValue(translations[locale], key as string);

				if (translation === undefined || translation === null) {
					console.warn(
						`Translation missing for key: ${key} in locale: ${locale}`,
					);
					return key;
				}

				if (typeof translation === 'object' && Array.isArray(translation)) {
					return translation;
				}

				let result = String(translation);

				// Remplacer les variables si fournies
				if (variables) {
					Object.entries(variables).forEach(([varKey, varValue]) => {
						result = result.replace(
							new RegExp(`{{${varKey}}}`, 'g'),
							String(varValue),
						);
					});
				}

				return result;
			} catch (error) {
				console.error(`Error translating key: ${key}`, error);
				return key;
			}
		},
		[locale],
	);

	const value: TranslationContextType = {
		locale,
		setLocale,
		t,
		availableLocales: ['fr', 'en', 'es'],
	};

	return (
		<TranslationContext.Provider value={value}>
			{children}
		</TranslationContext.Provider>
	);
}

export function useTranslation(): TranslationContextType {
	const context = useContext(TranslationContext);

	if (!context) {
		throw new Error('useI18n must be used within an I18nProvider');
	}

	return context;
}

export function useLocalURI(uri: string): string {
	const { locale } = useTranslation();
	return `${uri}?lang=${locale}`;
}
