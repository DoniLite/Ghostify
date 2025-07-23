import { Menu } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../utils/button';
import { linkClass } from '../utils/links';
import { Ghostify } from './Icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToogle';
import { useLocalURI, useTranslation } from './TranslationContext';

const Header = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const login = useLocalURI('/login');

	return (
		<header className="bg-background fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 lg:px-12 shadow">
			{/* Logo */}
			<div className="flex items-center space-x-2">
				<Ghostify className="h-6 w-6" />
				<span className="text-foreground font-nunito text-2xl font-bold">
					Ghostify
				</span>
			</div>

			{/* Desktop Navigation */}
			<nav className="hidden lg:flex items-center space-x-8">
				<NavLink to={useLocalURI('/')} className={linkClass}>
					{t('common.home')}
				</NavLink>
				<a
					href="/"
					className="text-foreground hover:text-primary font-nunito transition-colors"
				>
					{t('common.products')}
				</a>
				<NavLink to={useLocalURI('/pricing')} className={linkClass}>
					{t('common.pricing')}
				</NavLink>
				<NavLink to={useLocalURI('/contact')} className={linkClass}>
					{t('common.contact')}
				</NavLink>
			</nav>

			{/* Desktop Actions */}
			<div className="hidden lg:flex items-center space-x-4">
				<Button className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-nunito rounded-md px-5 py-2 transition-colors">
					{t('header.buttons.get_started')}
				</Button>
				<Button
					className="bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary font-nunito rounded-md px-5 py-2 transition-colors"
					onClick={() => navigate(login)}
				>
					{t('header.buttons.login')}
				</Button>
				<ThemeToggle />
				<LanguageSwitcher />
			</div>

			{/* Mobile Menu (Hamburger + Sheet) */}
			<Sheet>
				<SheetTrigger className="lg:hidden">
					<Menu className="h-6 w-6 text-foreground" />
				</SheetTrigger>
				<SheetContent
					side="right"
					className="w-64 bg-background flex flex-col justify-between py-8 px-6"
				>
					{/* Top Links */}
					<div className="flex flex-col space-y-4">
						<NavLink to={useLocalURI('/')} className={linkClass}>
							{t('common.home')}
						</NavLink>
						<a
							href="/"
							className="text-foreground hover:text-primary font-nunito transition-colors"
						>
							{t('common.products')}
						</a>
						<NavLink to={useLocalURI('/pricing')} className={linkClass}>
							{t('common.pricing')}
						</NavLink>
						<NavLink to={useLocalURI('/contact')} className={linkClass}>
							{t('common.contact')}
						</NavLink>

						<Button
							className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-nunito rounded-md py-2 transition-colors"
							onClick={() => navigate('/signup')}
						>
							{t('header.buttons.get_started')}
						</Button>
						<Button
							className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary font-nunito rounded-md py-2 transition-colors"
							onClick={() => navigate(login)}
						>
							{t('header.buttons.login')}
						</Button>
					</div>

					{/* Bottom Settings */}
					<div className="flex justify-between pt-8 border-t border-muted">
						<ThemeToggle />
						<LanguageSwitcher />
					</div>
				</SheetContent>
			</Sheet>
		</header>
	);
};

export default Header;
