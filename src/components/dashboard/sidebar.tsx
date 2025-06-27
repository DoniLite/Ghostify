import { AnglesRight } from '../../components/shared/Icons'
import Logo from '../../components/shared/Logo'

const Sidebar = () => {
  return (
    <div className="h-full bg-slate-200 text-gray-950 shadow-lg shadow-gray-950 transition-all duration-100">
      {/* Logo */}
      <div className="flex w-full items-center justify-between px-5 py-3">
        <Logo class="showOrHide hidden transition-all" />
        <button
          type="button"
          id="sidebarActionBtn"
          className="rotate-icon-just transition-all"
        >
          <AnglesRight class="h-6 w-6 fill-gray-950 dark:fill-white" />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="py-4">
        {/* Main Menu */}
        <div className="showOrHide hidden px-5 py-2 text-xs tracking-wider text-slate-400 uppercase transition-all">
          Principal
        </div>
        <a
          href="#"
          className="hover:text-primary before:bg-primary relative flex items-center bg-white/10 px-5 py-3 text-gray-950 before:absolute before:top-0 before:left-0 before:h-full before:w-1 hover:bg-white/10"
        >
          <i className="fas fa-home mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">
            Tableau de bord
          </span>
        </a>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-file-alt mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">
            Mes documents
          </span>
        </a>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-code mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">Développeurs</span>
        </a>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-file-pdf mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">
            Convertisseur
          </span>
        </a>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-id-card mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">
            Générateur de CV
          </span>
        </a>

        {/* Account Menu */}
        <div className="showOrHide mt-2 hidden px-5 py-2 text-xs tracking-wider text-slate-400 uppercase transition-all">
          Compte
        </div>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-credit-card mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">Abonnement</span>
        </a>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-cog mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">Paramètres</span>
        </a>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-question-circle mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">Aide ?</span>
        </a>
        <a
          href="#"
          className="hover:text-primary relative flex items-center px-5 py-3 text-gray-950 hover:bg-white/10"
        >
          <i className="fas fa-sign-out-alt mr-3 text-lg"></i>
          <span className="showOrHide hidden transition-all">Déconnexion</span>
        </a>
      </div>
    </div>
  )
}

export default Sidebar
