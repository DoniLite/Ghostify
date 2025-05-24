import { Monitor, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from './ThemeProvider.tsx';
import { Button } from '../utils/button.tsx';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, toggleTheme, isHydrated } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'system':
        return Monitor;
      case 'dark':
      default:
        return Moon;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Mode Clair';
      case 'system':
        return 'Mode Système';
      case 'dark':
      default:
        return 'Mode Sombre';
    }
  };

  // Affichage neutre pendant l'hydratation pour éviter le flash
  if (!isHydrated) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <div className='w-14 h-14 rounded-xl bg-card border border-border animate-pulse' />
      </div>
    );
  }

  const IconComponent = getIcon();

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      {/* Bouton principal */}
      <Button
        onClick={handleToggle}
        className={`
            relative overflow-hidden
            w-10 h-10 rounded-xl
            bg-card
            border border-border hover:border-primary/20
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            ${isAnimating ? 'scale-95' : 'hover:scale-105'}
          `}
        aria-label={`Basculer vers le ${getThemeLabel()}`}
      >
        {/* Effet de fond animé */}
        <div
          className={`
            absolute inset-0 rounded-xl
            bg-gradient-to-br from-primary/10 to-accent/10
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          `}
        />

        {/* Container pour l'icône avec animation */}
        <div
          className={`
            relative z-10 flex items-center justify-center w-full h-full
            ${isAnimating ? 'animate-spin' : ''}
            transition-transform duration-500 ease-out
          `}
        >
          <IconComponent
            size={20}
            className={`
                text-foreground group-hover:text-primary
                transition-all duration-300 ease-out
                ${isAnimating ? 'scale-110' : ''}
                drop-shadow-sm
              `}
          />
        </div>

        {/* Effet de ripple au clic */}
        <div
          className={`
            absolute inset-0 rounded-xl
            bg-primary/20
            transform scale-0 opacity-0
            ${isAnimating ? 'animate-ping scale-100 opacity-100' : ''}
            transition-all duration-500 ease-out
          `}
        />
      </Button>

      {/* Tooltip */}
      <div
        className={`
          absolute ${
          showLabel ? '-top-16' : '-top-12'
        } left-1/2 transform -translate-x-1/2
          px-3 py-1.5 rounded-lg
          bg-popover border border-border
          text-popover-foreground text-sm font-medium
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transition-all duration-200 ease-out
          whitespace-nowrap
          shadow-lg backdrop-blur-sm
          z-50
        `}
      >
        {getThemeLabel()}

        {/* Flèche du tooltip */}
        <div className='absolute top-full left-1/2 transform -translate-x-1/2'>
          <div className='w-2 h-2 bg-popover border-r border-b border-border transform rotate-45 -mt-1' />
        </div>
      </div>

      {/* Label optionnel */}
      {showLabel && (
        <span className='ml-3 text-sm font-medium text-foreground'>
          {getThemeLabel()}
        </span>
      )}

      {/* Indicateur de thème actuel */}
      <div
        className={`
          absolute -bottom-1 -right-1
          w-4 h-4 rounded-full
          border-2 border-background
          transition-all duration-300 ease-out
          shadow-sm
          ${
          theme === 'dark'
            ? 'bg-slate-600'
            : theme === 'light'
            ? 'bg-amber-400'
            : 'bg-blue-500'
        }
        `}
      />
    </div>
  );
};
