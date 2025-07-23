import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import type { Locale } from '../../@types/translation';
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTranslation } from './TranslationContext';

export function LanguageSwitcher() {
	const { locale, setLocale, availableLocales } = useTranslation();

	const localeNames: Record<Locale, string> = {
		fr: 'Fr',
		en: 'En',
		es: 'Es',
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="border-border border w-10 h-10 rounded-md bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
				{locale}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="border-border bg-card text-card-foreground rounded-md border">
				{availableLocales
					.filter((loc) => loc !== locale)
					.map((loc) => (
						<DropdownMenuItem
							key={loc}
							onSelect={() => setLocale(loc)}
							className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
						>
							{localeNames[loc]}
						</DropdownMenuItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
