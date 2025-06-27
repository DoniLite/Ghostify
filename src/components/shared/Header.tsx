import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../utils/button';
import { linkClass } from '../utils/links';
import { Ghostify } from './Icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToogle';
import { useLocalURI, useTranslation } from './TranslationContext';

const Header = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	return (
		<header className="bg-background fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 lg:px-12">
			<div className="flex items-center space-x-2">
				<Ghostify className="h-6 w-6" />
				<span className="text-foreground font-nunito text-2xl font-bold">
					Ghostify
				</span>
			</div>
			<nav className="hidden items-center space-x-8 lg:flex">
				<NavLink to={useLocalURI('/')} className={linkClass}>
					{t('common.home')}
				</NavLink>
				<a
					href="#"
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
			<div className="flex items-center space-x-4">
				<Button className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-nunito cursor-pointer rounded-md px-5 py-2 transition-colors">
					{t('header.buttons.get_started')}
				</Button>
				<Button
					className="bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary font-nunito cursor-pointer rounded-md px-5 py-2 transition-colors"
					onClick={() => {
						navigate(useLocalURI('/login'));
					}}
				>
					{t('header.buttons.login')}
				</Button>
				<ThemeToggle />
				<LanguageSwitcher />
			</div>
		</header>
	);
};

export default Header;
