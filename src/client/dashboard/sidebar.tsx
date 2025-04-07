import Logo from '../../components/shared/Logo.tsx';

const Sidebar = () => {
  return (
    <div class='h-screen bg-slate-800 text-white transition-all duration-300 overflow-y-auto'>
      {/* Logo */}
      <Logo />

      {/* Navigation Menu */}
      <div class='py-4'>
        {/* Main Menu */}
        <div class='px-5 py-2 text-xs uppercase tracking-wider text-slate-400'>
          Principal
        </div>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary bg-white/10 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary'
        >
          <i class='fas fa-home mr-3 text-lg'></i>
          <span>Tableau de bord</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-file-alt mr-3 text-lg'></i>
          <span>Mes documents</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-code mr-3 text-lg'></i>
          <span>APIs</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-blog mr-3 text-lg'></i>
          <span>Mes blogs</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-file-pdf mr-3 text-lg'></i>
          <span>Convertisseur</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-id-card mr-3 text-lg'></i>
          <span>Générateur de CV</span>
        </a>

        {/* Account Menu */}
        <div class='px-5 py-2 mt-2 text-xs uppercase tracking-wider text-slate-400'>
          Compte
        </div>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-credit-card mr-3 text-lg'></i>
          <span>Abonnement</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-cog mr-3 text-lg'></i>
          <span>Paramètres</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-question-circle mr-3 text-lg'></i>
          <span>Aide</span>
        </a>
        <a
          href='#'
          class='flex items-center px-5 py-3 text-white relative hover:bg-white/10 hover:text-primary'
        >
          <i class='fas fa-sign-out-alt mr-3 text-lg'></i>
          <span>Déconnexion</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
