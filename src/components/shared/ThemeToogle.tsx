import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'; // Importe useRef et useEffect
import { Button } from '../utils/button';
import { useTheme } from './ThemeProvider';
import { useTranslation } from './TranslationContext';

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
	const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>(
		'top',
	);
	const { t } = useTranslation();
	const buttonRef = useRef<HTMLButtonElement>(null);

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
			default:
				return Moon;
		}
	};

	const getThemeLabel = () => {
		return t(`common.mode.${theme}`);
	};

	useEffect(() => {
		const checkTooltipPosition = () => {
			if (buttonRef.current) {
				const buttonRect = buttonRef.current.getBoundingClientRect();
				const tooltipHeight = showLabel ? 64 : 48;

				if (buttonRect.top < tooltipHeight + 20) {
					setTooltipPosition('bottom');
				} else {
					setTooltipPosition('top');
				}
			}
		};

		checkTooltipPosition();

		globalThis.addEventListener('scroll', checkTooltipPosition);
		globalThis.addEventListener('resize', checkTooltipPosition);

		return () => {
			globalThis.removeEventListener('scroll', checkTooltipPosition);
			globalThis.removeEventListener('resize', checkTooltipPosition);
		};
	}, [showLabel]);

	if (!isHydrated) {
		return (
			<div className={`relative inline-flex items-center ${className}`}>
				<div className="bg-card border-border h-14 w-14 animate-pulse rounded-xl border" />
			</div>
		);
	}

	const IconComponent = getIcon();

	const tooltipClasses = `
    absolute left-1/2 transform -translate-x-1/2
    px-3 py-1.5 rounded-lg
    bg-popover border border-border
    text-popover-foreground text-sm font-medium
    opacity-0 group-hover:opacity-100
    pointer-events-none
    transition-all duration-200 ease-out
    whitespace-nowrap
    shadow-lg backdrop-blur-sm
    z-50
  `;

	const tooltipPositionClasses =
		tooltipPosition === 'top'
			? `${showLabel ? '-top-16' : '-top-12'}`
			: `${showLabel ? 'top-full mt-4' : 'top-full mt-3'}`;

	const tooltipArrowClasses =
		tooltipPosition === 'top'
			? 'absolute top-full left-1/2 transform -translate-x-1/2'
			: 'absolute bottom-full left-1/2 transform -translate-x-1/2';

	const tooltipArrowInnerClasses =
		tooltipPosition === 'top'
			? 'w-2 h-2 bg-popover border-r border-b border-border transform rotate-45 -mt-1'
			: 'w-2 h-2 bg-popover border-l border-t border-border transform rotate-45 mt-1';

	return (
		<div className={`group relative inline-flex items-center ${className}`}>
			<Button
				ref={buttonRef}
				onClick={handleToggle}
				className={`bg-card border-border hover:border-primary/20 focus:ring-ring relative h-10 w-10 overflow-hidden rounded-xl border transition-all duration-300 ease-out focus:ring-2 focus:ring-offset-2 focus:outline-none ${isAnimating ? 'scale-95' : 'hover:scale-105'} `}
				aria-label={`Basculer vers le ${getThemeLabel()}`}
			>
				<div
					className={`from-primary/10 to-accent/10 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
				/>

				<div
					className={`relative z-10 flex h-full w-full items-center justify-center ${isAnimating ? 'animate-spin' : ''} transition-transform duration-500 ease-out`}
				>
					<IconComponent
						size={20}
						className={`text-foreground group-hover:text-primary transition-all duration-300 ease-out ${isAnimating ? 'scale-110' : ''} drop-shadow-sm`}
					/>
				</div>

				<div
					className={`bg-primary/20 absolute inset-0 scale-0 transform rounded-xl opacity-0 ${isAnimating ? 'scale-100 animate-ping opacity-100' : ''} transition-all duration-500 ease-out`}
				/>
			</Button>

			<div className={`${tooltipClasses} ${tooltipPositionClasses}`}>
				{getThemeLabel()}

				<div className={tooltipArrowClasses}>
					<div className={tooltipArrowInnerClasses} />
				</div>
			</div>

			{showLabel && (
				<span className="text-foreground ml-3 text-sm font-medium">
					{getThemeLabel()}
				</span>
			)}

			<div
				className={`border-background absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 shadow-sm transition-all duration-300 ease-out ${
					theme === 'dark'
						? 'bg-slate-600'
						: theme === 'light'
							? 'bg-amber-400'
							: 'bg-blue-500'
				} `}
			/>
		</div>
	);
};
