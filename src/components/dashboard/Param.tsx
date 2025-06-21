const Param = ({ hide }: { hide: boolean }) => {
  return (
    <div
      className={`fixed left-[25%] top-8 w-[70%] py-6 sm:px-6 lg:px-8 ${
        hide ? 'translate-x-[200%]' : 'translate-x-[0]'
      }`}
    >
      <div className="px-4 py-6 sm:px-0">
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="mr-8 hidden w-64 md:block">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Paramètres</h3>
              <ul>
                <li className="mb-2">
                  <a
                    href="#"
                    className="flex items-center font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <i className="fas fa-user-circle mr-2"></i>
                    Profil
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="flex items-center text-gray-600 hover:text-indigo-600"
                  >
                    <i className="fas fa-lock mr-2"></i>
                    Sécurité
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="flex items-center text-gray-600 hover:text-indigo-600"
                  >
                    <i className="fas fa-bell mr-2"></i>
                    Notifications
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="flex items-center text-gray-600 hover:text-indigo-600"
                  >
                    <i className="fas fa-credit-card mr-2"></i>
                    Facturation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-gray-600 hover:text-indigo-600"
                  >
                    <i className="fas fa-key mr-2"></i>
                    Clés API
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profil Utilisateur</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Informations personnelles et paramètres du compte
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form>
                  <div className="mb-8 flex items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-4xl text-indigo-400">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="ml-5">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Changer la photo
                      </button>
                      <button
                        type="button"
                        className="ml-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Prénom
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value="Jean"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nom
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value="Dupont"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Adresse e-mail
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value="jean.dupont@exemple.com"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Entreprise
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="company"
                          id="company"
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value="Tech Solutions SAS"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Pays
                      </label>
                      <div className="mt-1">
                        <select
                          id="country"
                          name="country"
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option selected>France</option>
                          <option>Belgique</option>
                          <option>Suisse</option>
                          <option>Canada</option>
                          <option>Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="timezone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Fuseau horaire
                      </label>
                      <div className="mt-1">
                        <select
                          id="timezone"
                          name="timezone"
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

                  <div className="pt-8">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Préférences de notification
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Gérez comment vous souhaitez être notifié
                      </p>
                    </div>
                    <div className="mt-6">
                      <div className="mb-4 flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="email_notifications"
                            name="email_notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="email_notifications"
                            className="font-medium text-gray-700"
                          >
                            Notifications par e-mail
                          </label>
                          <p className="text-gray-500">
                            Recevez des mises à jour sur vos projets, actions et nouvelles
                            fonctionnalités
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="marketing_emails"
                            name="marketing_emails"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="marketing_emails"
                            className="font-medium text-gray-700"
                          >
                            E-mails marketing
                          </label>
                          <p className="text-gray-500">
                            Recevez des communications sur nos offres, événements et nouvelles
                            fonctionnalités
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
  )
}

export default Param
