import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

// Types pour le thème
type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isHydrated: boolean
}

// Context du thème
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Hook pour utiliser le context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Script à injecter côté serveur pour éviter le flash
export const getThemeScript = (defaultTheme: Theme = 'dark') => {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('theme') || '${defaultTheme}';
        var resolvedTheme = theme;
        
        if (theme === 'system') {
          resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.classList.add(resolvedTheme);
        document.body.classList.add(resolvedTheme);
        document.documentElement.setAttribute('data-theme', resolvedTheme);
      } catch (e) {
        console.error('Erreur lors de l\\'initialisation du thème:', e);
      }
    })();
  `
}

// Provider du thème
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  serverTheme?: ResolvedTheme
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark',
  serverTheme = 'dark'
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(serverTheme)
  const [isHydrated, setIsHydrated] = useState(false)

  // Fonction pour résoudre le thème système
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'dark'
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }, [])

  // Fonction pour résoudre le thème
  const resolveTheme = useCallback(
    (themeValue: Theme): ResolvedTheme => {
      return themeValue === 'system' ? getSystemTheme() : themeValue
    },
    [getSystemTheme]
  )

  // Fonction pour appliquer le thème au DOM
  const applyTheme = useCallback((resolved: ResolvedTheme) => {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    const { body } = document

    // Supprimer les anciennes classes
    html.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')

    // Appliquer le nouveau thème
    html.classList.add(resolved)
    body.classList.add(resolved)
    html.setAttribute('data-theme', resolved)
  }, [])

  // Fonction pour définir le thème
  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('theme', newTheme)
        } catch (error) {
          console.error('Erreur lors de la sauvegarde du thème:', error)
        }
      }

      const resolved = resolveTheme(newTheme)
      setThemeState(newTheme)
      setResolvedTheme(resolved)
      applyTheme(resolved)
    },
    [resolveTheme, applyTheme]
  )

  // Fonction pour basculer entre les thèmes
  const toggleTheme = useCallback(() => {
    const themeOrder: Theme[] = ['dark', 'light', 'system']
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex]!)
  }, [theme, setTheme])

  // Effet d'hydratation côté client
  useEffect(() => {
    if (typeof window === 'undefined') return

    let savedTheme: Theme = defaultTheme

    try {
      const stored = localStorage.getItem('theme') as Theme
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        savedTheme = stored
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du thème:', error)
    }

    const resolved = resolveTheme(savedTheme)

    setThemeState(savedTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    setIsHydrated(true)

    // Écouter les changements de préférence système
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (savedTheme === 'system') {
        const newResolved = getSystemTheme()
        setResolvedTheme(newResolved)
        applyTheme(newResolved)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [defaultTheme, resolveTheme, applyTheme, getSystemTheme])

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isHydrated
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
