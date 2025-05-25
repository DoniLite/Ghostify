import { Locale } from '../@types/translation.ts';

export function detectLocale(request?: Request): Locale {
  const defaultLocale: Locale = 'fr';

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('preferred-locale') as Locale;
    if (saved && ['fr', 'en', 'es'].includes(saved)) {
      return saved;
    }

    const urlParams = new URLSearchParams(globalThis.location.search);
    const langParam = urlParams.get('lang') as Locale;
    if (langParam && ['fr', 'en', 'es'].includes(langParam)) {
      return langParam;
    }

    const browserLang = navigator.language.split('-')[0] as Locale;
    if (['fr', 'en', 'es'].includes(browserLang)) {
      return browserLang;
    }
  } else if (request) {
    const url = new URL(request.url);
    const langParam = url.searchParams.get('lang') as Locale;
    if (langParam && ['fr', 'en', 'es'].includes(langParam)) {
      return langParam;
    }

    const acceptLanguage = request.headers.get('Accept-Language');
    if (acceptLanguage) {
      const languages = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].split('-')[0].trim())
        .filter((lang) => ['fr', 'en', 'es'].includes(lang));

      if (languages.length > 0) {
        return languages[0] as Locale;
      }
    }

    const cookies = request.headers.get('Cookie');
    if (cookies) {
      const localeMatch = cookies.match(/locale=([^;]+)/);
      if (localeMatch && ['fr', 'en', 'es'].includes(localeMatch[1])) {
        return localeMatch[1] as Locale;
      }
    }
  }

  return defaultLocale;
}

export function createTranslationHeaders(locale: Locale): Headers {
  const headers = new Headers();
  headers.set(
    'Set-Cookie',
    `locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`,
  );
  headers.set('Content-Language', locale);
  return headers;
}
