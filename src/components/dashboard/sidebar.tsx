import { AnglesRight } from '../../components/shared/Icons.tsx';
import Logo from '../../components/shared/Logo.tsx';

const Sidebar = () => {
  return (
    <div class='h-full bg-slate-200 text-gray-950 transition-all duration-100 shadow-lg shadow-gray-950'>
      {/* Logo */}
      <div class=' flex w-full px-5 py-3 justify-between items-center'>
        <Logo class='showOrHide hidden transition-all' />
        <button
          type='button'
          id='sidebarActionBtn'
          class='transition-all rotate-icon-just'
        >
          <AnglesRight class='dark:fill-white fill-gray-950 w-6 h-6' />
        </button>
      </div>

      {/* Navigation Menu */}
      <div class='py-4'>
        {/* Main Menu */}
        <div class='showOrHide hidden transition-all px-5 py-2 text-xs uppercase tracking-wider text-slate-400'>
          Principal
        </div>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary bg-white/10 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary'
        >
          <i class='fas fa-home mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Tableau de bord</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-file-alt mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Mes documents</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-code mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Développeurs</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-file-pdf mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Convertisseur</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-id-card mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Générateur de CV</span>
        </a>

        {/* Account Menu */}
        <div class='showOrHide hidden transition-all px-5 py-2 mt-2 text-xs uppercase tracking-wider text-slate-400'>
          Compte
        </div>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-credit-card mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Abonnement</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-cog mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Paramètres</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-question-circle mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Aide ?</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-gray-950 relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-sign-out-alt mr-3 text-lg'></i>
          <span class='showOrHide hidden transition-all'>Déconnexion</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
