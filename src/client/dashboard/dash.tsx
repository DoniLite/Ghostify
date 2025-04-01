import { render } from 'npm:hono/jsx/dom';
import Sidebar from './sidebar.tsx';



const Dashboard = () => {
    return (
      <div class='flex min-h-screen'>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div class='ml-64 flex-1 p-5'>
          {/* Header */}
          <div class='flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm'>
            <h1 class='text-2xl font-semibold'>Tableau de bord</h1>

            <div class='flex items-center gap-3'>
              <div class='relative mr-4'>
                <i class='fas fa-bell'></i>
                <div class='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center'>
                  3
                </div>
              </div>
              <div class='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold'>
                JD
              </div>
              <div>Jean Dupont</div>
            </div>
          </div>

          {/* Subscription Card */}
          <div class='bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 mb-8 relative overflow-hidden'>
            <div class='absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/3'></div>
            <div class='text-2xl font-bold mb-2'>Plan Professionnel</div>
            <div>Votre abonnement expire dans 18 jours</div>

            <div class='flex justify-between mt-5 space-x-4'>
              <div class='bg-white/20 p-3 rounded-lg text-center'>
                <div class='text-lg font-semibold'>500 Go</div>
                <div class='text-xs opacity-80'>Stockage</div>
              </div>
              <div class='bg-white/20 p-3 rounded-lg text-center'>
                <div class='text-lg font-semibold'>10 000</div>
                <div class='text-xs opacity-80'>Requêtes API/mois</div>
              </div>
              <div class='bg-white/20 p-3 rounded-lg text-center'>
                <div class='text-lg font-semibold'>Illimité</div>
                <div class='text-xs opacity-80'>Documents</div>
              </div>
              <div class='bg-white/20 p-3 rounded-lg text-center'>
                <div class='text-lg font-semibold'>29€</div>
                <div class='text-xs opacity-80'>/mois</div>
              </div>
            </div>

            <button
              type='button'
              class='mt-5 px-4 py-2 bg-white/20 text-white rounded-lg flex items-center'
            >
              <i class='fas fa-arrow-up mr-2'></i> Mettre à niveau
            </button>
          </div>

          {/* Stats Grid */}
          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
            {/* Documents Stats */}
            <div class='bg-white rounded-lg p-5 shadow-sm flex flex-col'>
              <div class='flex justify-between items-center mb-5'>
                <div class='text-slate-500 text-sm'>Documents créés</div>
                <div class='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white'>
                  <i class='fas fa-file-alt'></i>
                </div>
              </div>
              <div class='text-3xl font-bold mb-1'>128</div>
              <div class='text-slate-500 text-sm'>
                +12% par rapport au mois dernier
              </div>
            </div>

            {/* API Stats */}
            <div class='bg-white rounded-lg p-5 shadow-sm flex flex-col'>
              <div class='flex justify-between items-center mb-5'>
                <div class='text-slate-500 text-sm'>Utilisation API</div>
                <div class='w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white'>
                  <i class='fas fa-code'></i>
                </div>
              </div>
              <div class='text-3xl font-bold mb-1'>5,384</div>
              <div class='text-slate-500 text-sm'>Requêtes ce mois-ci</div>
            </div>

            {/* Storage Stats */}
            <div class='bg-white rounded-lg p-5 shadow-sm flex flex-col'>
              <div class='flex justify-between items-center mb-5'>
                <div class='text-slate-500 text-sm'>Stockage utilisé</div>
                <div class='w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white'>
                  <i class='fas fa-database'></i>
                </div>
              </div>
              <div class='text-3xl font-bold mb-1'>189 Go</div>
              <div class='text-slate-500 text-sm'>37.8% de votre quota</div>
            </div>

            {/* Payment Stats */}
            <div class='bg-white rounded-lg p-5 shadow-sm flex flex-col'>
              <div class='flex justify-between items-center mb-5'>
                <div class='text-slate-500 text-sm'>Prochain paiement</div>
                <div class='w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white'>
                  <i class='fas fa-calendar'></i>
                </div>
              </div>
              <div class='text-3xl font-bold mb-1'>15/03/2025</div>
              <div class='text-slate-500 text-sm'>29€ - Plan Professionnel</div>
            </div>
          </div>

          {/* Services Section  */}
          <div class='flex justify-between items-center mb-4'>
            <h2 class='text-lg font-semibold'>Services disponibles</h2>
            <a
              href='#'
              class='px-4 py-2 border border-slate-200 rounded-lg text-sm'
            >
              Voir tout
            </a>
          </div>

          <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
            {/* Document Service */}
            <div class='bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-md cursor-pointer'>
              <div class='h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-4xl'>
                <i class='fas fa-file-alt'></i>
              </div>
              <div class='p-4'>
                <h3 class='font-semibold mb-2'>Traducteur de documents</h3>
                <p class='text-sm text-slate-500 mb-4'>
                  Convertissez vos documents en ligne avec support de plusieurs
                  types de langues
                </p>
                <span class='inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full'>
                  Populaires
                </span>
              </div>
            </div>

            {/* Blog Service */}
            {/* <div class="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
                    <div class="h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-4xl">
                        <i class="fas fa-blog"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold mb-2">Création de blog</h3>
                        <p class="text-sm text-slate-500 mb-4">Publiez et gérez facilement votre contenu avec notre éditeur intuitif</p>
                        <span class="inline-block px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full">Nouveau</span>
                    </div>
                </div> */}

            {/* Converter Service */}
            <div class='bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-md cursor-pointer'>
              <div class='h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-4xl'>
                <i class='fas fa-file-pdf'></i>
              </div>
              <div class='p-4'>
                <h3 class='font-semibold mb-2'>Convertisseur de documents</h3>
                <p class='text-sm text-slate-500 mb-4'>
                  Convertissez vos documents dans différents formats en quelques
                  clics
                </p>
              </div>
            </div>

            {/* CV Service */}
            <div class='bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-md cursor-pointer'>
              <div class='h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-4xl'>
                <i class='fas fa-id-card'></i>
              </div>
              <div class='p-4'>
                <h3 class='font-semibold mb-2'>Générateur de CV</h3>
                <p class='text-sm text-slate-500 mb-4'>
                  Créez des CV professionnels avec nos modèles optimisés pour
                  les recruteurs
                </p>
              </div>
            </div>
          </div>

          {/* Settings Section  */}
          <div class='bg-white rounded-lg shadow-sm p-5 mb-8'>
            <h2 class='text-lg font-semibold mb-4'>Paramètres du compte</h2>

            <div>
              {/* Email Notifications */}
              <div class='flex justify-between items-center py-4 border-b border-slate-200'>
                <div class='max-w-3/4'>
                  <div class='font-medium mb-1'>Notifications par email</div>
                  <div class='text-sm text-slate-500'>
                    Recevez des mises à jour sur vos documents, votre abonnement
                    et les nouvelles fonctionnalités
                  </div>
                </div>
                <label class='relative inline-block w-12 h-6'>
                  <input type='checkbox' class='opacity-0 w-0 h-0' checked />
                  <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-200 rounded-full transition-all duration-400 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-400 checked:bg-primary checked:before:transform checked:before:translate-x-6"></span>
                </label>
              </div>

              {/* 2FA */}
              <div class='flex justify-between items-center py-4 border-b border-slate-200'>
                <div class='max-w-3/4'>
                  <div class='font-medium mb-1'>
                    Authentification à deux facteurs
                  </div>
                  <div class='text-sm text-slate-500'>
                    Ajouter une couche supplémentaire de sécurité à votre compte
                  </div>
                </div>
                <label class='relative inline-block w-12 h-6'>
                  <input type='checkbox' class='opacity-0 w-0 h-0' />
                  <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-200 rounded-full transition-all duration-400 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-400 checked:bg-primary checked:before:transform checked:before:translate-x-6"></span>
                </label>
              </div>

              {/* Dark Mode */}
              <div class='flex justify-between items-center py-4'>
                <div class='max-w-3/4'>
                  <div class='font-medium mb-1'>Mode sombre</div>
                  <div class='text-sm text-slate-500'>
                    Changer l'apparence de l'interface pour réduire la fatigue
                    oculaire
                  </div>
                </div>
                <label class='relative inline-block w-12 h-6'>
                  <input type='checkbox' class='opacity-0 w-0 h-0' />
                  <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-200 rounded-full transition-all duration-400 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-400 checked:bg-primary checked:before:transform checked:before:translate-x-6"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Plans Section */}
          <div class='bg-white rounded-lg shadow-sm p-5'>
            <h2 class='text-lg font-semibold mb-4'>Options d'abonnement</h2>

            <div class='overflow-x-auto'>
              <table class='min-w-full'>
                <thead>
                  <tr>
                    <th class='py-4 px-4 text-left bg-slate-50 font-semibold'>
                      Plan
                    </th>
                    <th class='py-4 px-4 text-left bg-slate-50 font-semibold'>
                      Stockage
                    </th>
                    <th class='py-4 px-4 text-left bg-slate-50 font-semibold'>
                      Requêtes API
                    </th>
                    <th class='py-4 px-4 text-left bg-slate-50 font-semibold'>
                      Documents
                    </th>
                    <th class='py-4 px-4 text-left bg-slate-50 font-semibold'>
                      Prix
                    </th>
                    <th class='py-4 px-4 text-left bg-slate-50 font-semibold'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Free Plan */}
                  <tr>
                    <td class='py-4 px-4 border-b border-slate-200 font-medium'>
                      Gratuit
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>5 Go</td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      500 / mois
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      5 actifs
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      <div class='text-xl font-bold text-primary'>0€</div>
                      <div class='text-sm text-slate-500'>Pour toujours</div>
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      <button
                        type='button'
                        class='px-4 py-2 border border-slate-200 rounded-lg text-sm'
                      >
                        Rétrograder
                      </button>
                    </td>
                  </tr>

                  {/* Pro Plan */}
                  <tr class='bg-secondary/5'>
                    <td class='py-4 px-4 border-b border-slate-200 font-medium'>
                      Professionnel
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>500 Go</td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      10 000 / mois
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      Illimité
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      <div class='text-xl font-bold text-primary'>29€</div>
                      <div class='text-sm text-slate-500'>Par mois</div>
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      <button
                        type='button'
                        class='px-4 py-2 bg-primary text-white rounded-lg text-sm'
                        disabled
                      >
                        Plan actuel
                      </button>
                    </td>
                  </tr>

                  {/* Enterprise Plan */}
                  <tr>
                    <td class='py-4 px-4 border-b border-slate-200 font-medium'>
                      Entreprise
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>2 To</td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      100 000 / mois
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      Illimité
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      <div class='text-xl font-bold text-primary'>99€</div>
                      <div class='text-sm text-slate-500'>Par mois</div>
                    </td>
                    <td class='py-4 px-4 border-b border-slate-200'>
                      <button
                        type='button'
                        class='px-4 py-2 border border-slate-200 rounded-lg text-sm'
                      >
                        Mettre à niveau
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
}


const root = document?.getElementById('root')!;
render(<Dashboard />, root);