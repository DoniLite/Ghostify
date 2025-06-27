import en from '../../locales/en';
import es from '../../locales/es';
import fr from '../../locales/fr';

export type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}.${P}`
		: never
	: never;

export type DeepKeyOf<T> = {
	[K in keyof T]: T[K] extends object ? K | Join<K, DeepKeyOf<T[K]>> : K;
}[keyof T];

export type StringToPath<S extends string> =
	S extends `${infer Head}.${infer Tail}` ? [Head, ...StringToPath<Tail>] : [S];

export type PathValue<T, Path extends readonly string[]> = Path extends [
	infer Head,
	...infer Tail,
]
	? Head extends keyof T
		? Tail extends string[]
			? PathValue<T[Head], Tail>
			: T[Head]
		: never
	: T;

export type DeepValue<T, K extends string> = PathValue<T, StringToPath<K>>;

export type TranslationsFr = typeof fr;
export type TranslationsEs = typeof es;
export type TranslationsEn = typeof en;

export type TranslationKeys =
	| DeepKeyOf<TranslationsFr>
	| DeepKeyOf<TranslationsEs>
	| DeepKeyOf<TranslationsEn>;

export type Translations = {
	fr: TranslationsFr;
	en: TranslationsEn;
	es: TranslationsEs;
};

export const translations: Translations = { fr, en, es };

export type Locale = 'fr' | 'en' | 'es';

export function getDeepValue<T, K extends string>(
	obj: T,
	path: K,
): DeepValue<T, K> {
	const parts = path.split('.');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let result: any = obj;

	for (const part of parts) {
		result = result?.[part];
	}

	return result;
}
