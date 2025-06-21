import { Locale } from '../../@types/translation.ts'
import { useTranslation } from './TranslationContext.tsx'

export function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useTranslation()

  const localeNames: Record<Locale, string> = {
    fr: 'Fr',
    en: 'En',
    es: 'Es'
  }

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="border-border bg-card text-card-foreground rounded-md border px-3 py-2"
    >
      {availableLocales.map((loc) => (
        <option
          key={loc}
          value={loc}
        >
          {localeNames[loc]}
        </option>
      ))}
    </select>
  )
}
