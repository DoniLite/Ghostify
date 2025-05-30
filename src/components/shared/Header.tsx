import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../utils/button.tsx';
import { Ghostify } from './Icons.tsx';
import { linkClass } from '../utils/links.ts';
import { ThemeToggle } from './ThemeToogle.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { useLocalURI, useTranslation } from './TranslationContext.tsx';

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <header className='fixed top-0 left-0 w-full z-50 py-4 px-6 lg:px-12 flex items-center justify-between bg-background'>
      <div className='flex items-center space-x-2'>
        <Ghostify className='h-6 w-6' />
        <span className='font-bold text-2xl text-foreground font-nunito'>
          Ghostify
        </span>
      </div>
      <nav className='hidden lg:flex items-center space-x-8'>
        <NavLink
          to={useLocalURI('/')}
          className={linkClass}
        >
          {t('common.home')}
        </NavLink>
        <a
          href='#'
          className='text-foreground hover:text-primary transition-colors font-nunito'
        >
          {t('common.products')}
        </a>
        <a
          href='#'
          className='text-foreground hover:text-primary transition-colors font-nunito'
        >
          {t('common.pricing')}
        </a>
        <a
          href='#'
          className='text-foreground hover:text-primary transition-colors font-nunito'
        >
          {t('common.contact')}
        </a>
      </nav>
      <div className='flex items-center space-x-4'>
        <Button className='bg-primary cursor-pointer text-primary-foreground px-5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-nunito'>
          {t('header.buttons.get_started')}
        </Button>
        <Button
          className='bg-secondary cursor-pointer text-secondary-foreground px-5 py-2 rounded-md hover:bg-secondary-foreground hover:text-secondary transition-colors font-nunito'
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
