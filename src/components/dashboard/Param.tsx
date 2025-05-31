const Param = ({hide}: {hide: boolean}) => {
  return (
    <div
      className={`w-[70%] fixed top-8 py-6 left-[25%] sm:px-6 lg:px-8 ${
        hide ? 'translate-x-[200%]' : 'translate-x-[0]'
      }`}
    >
      <div className='px-4 py-6 sm:px-0'>
        <div className='flex'>
          {/* Sidebar Navigation */}
          <div className='w-64 mr-8 hidden md:block'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Paramètres</h3>
              <ul>
                <li className='mb-2'>
                  <a
                    href='#'
                    className='flex items-center text-indigo-600 hover:text-indigo-800 font-medium'
                  >
                    <i className='fas fa-user-circle mr-2'></i>
                    Profil
                  </a>
                </li>
                <li className='mb-2'>
                  <a
                    href='#'
                    className='flex items-center text-gray-600 hover:text-indigo-600'
                  >
                    <i className='fas fa-lock mr-2'></i>
                    Sécurité
                  </a>
                </li>
                <li className='mb-2'>
                  <a
                    href='#'
                    className='flex items-center text-gray-600 hover:text-indigo-600'
                  >
                    <i className='fas fa-bell mr-2'></i>
                    Notifications
                  </a>
                </li>
                <li className='mb-2'>
                  <a
                    href='#'
                    className='flex items-center text-gray-600 hover:text-indigo-600'
                  >
                    <i className='fas fa-credit-card mr-2'></i>
                    Facturation
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='flex items-center text-gray-600 hover:text-indigo-600'
                  >
                    <i className='fas fa-key mr-2'></i>
                    Clés API
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
              <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  Profil Utilisateur
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                  Informations personnelles et paramètres du compte
                </p>
              </div>
              <div className='px-4 py-5 sm:p-6'>
                <form>
                  <div className='mb-8 flex items-center'>
                    <div className='h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 text-4xl'>
                      <i className='fas fa-user'></i>
                    </div>
                    <div className='ml-5'>
                      <button
                        type='button'
                        className='bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        Changer la photo
                      </button>
                      <button
                        type='button'
                        className='ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                    <div className='sm:col-span-3'>
                      <label
                        htmlFor='first_name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Prénom
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          name='first_name'
                          id='first_name'
                          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                          value='Jean'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-3'>
                      <label
                        htmlFor='last_name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Nom
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          name='last_name'
                          id='last_name'
                          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                          value='Dupont'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-6'>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Adresse e-mail
                      </label>
                      <div className='mt-1'>
                        <input
                          type='email'
                          name='email'
                          id='email'
                          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                          value='jean.dupont@exemple.com'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-6'>
                      <label
                        htmlFor='company'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Entreprise
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          name='company'
                          id='company'
                          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                          value='Tech Solutions SAS'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-6'>
                      <label
                        htmlFor='country'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Pays
                      </label>
                      <div className='mt-1'>
                        <select
                          id='country'
                          name='country'
                          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                        >
                          <option selected>France</option>
                          <option>Belgique</option>
                          <option>Suisse</option>
                          <option>Canada</option>
                          <option>Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className='sm:col-span-6'>
                      <label
                        htmlFor='timezone'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Fuseau horaire
                      </label>
                      <div className='mt-1'>
                        <select
                          id='timezone'
                          name='timezone'
                          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                        >
                          <option selected>Europe/Paris (UTC+01:00)</option>
                          <option>Europe/Brussels (UTC+01:00)</option>
                          <option>Europe/Zurich (UTC+01:00)</option>
                          <option>America/Montreal (UTC-05:00)</option>
                          <option>Autre</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className='pt-8'>
                    <div>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>
                        Préférences de notification
                      </h3>
                      <p className='mt-1 text-sm text-gray-500'>
                        Gérez comment vous souhaitez être notifié
                      </p>
                    </div>
                    <div className='mt-6'>
                      <div className='flex items-start mb-4'>
                        <div className='flex items-center h-5'>
                          <input
                            id='email_notifications'
                            name='email_notifications'
                            type='checkbox'
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
                            checked
                          />
                        </div>
                        <div className='ml-3 text-sm'>
                          <label
                            htmlFor='email_notifications'
                            className='font-medium text-gray-700'
                          >
                            Notifications par e-mail
                          </label>
                          <p className='text-gray-500'>
                            Recevez des mises à jour sur vos projets, actions et
                            nouvelles fonctionnalités
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start mb-4'>
                        <div className='flex items-center h-5'>
                          <input
                            id='marketing_emails'
                            name='marketing_emails'
                            type='checkbox'
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
                          />
                        </div>
                        <div className='ml-3 text-sm'>
                          <label
                            htmlFor='marketing_emails'
                            className='font-medium text-gray-700'
                          >
                            E-mails marketing
                          </label>
                          <p className='text-gray-500'>
                            Recevez des communications sur nos offres,
                            événements et nouvelles fonctionnalités
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='pt-5'>
                    <div className='flex justify-end'>
                      <button
                        type='button'
                        className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        Annuler
                      </button>
                      <button
                        type='submit'
                        className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Param;