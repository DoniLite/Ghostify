const Dashboard = () => {
	return (
		<div className="h-full w-full overflow-y-scroll p-5 transition-all">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
				<h1 className="text-2xl font-semibold">Tableau de bord</h1>

				<div className="flex items-center gap-3">
					<div className="relative mr-4">
						<i className="fas fa-bell"></i>
						<div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
							3
						</div>
					</div>
					<div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white">
						JD
					</div>
					<div>Jean Dupont</div>
				</div>
			</div>

			{/* Subscription Card */}
			<div className="from-primary to-secondary relative mb-8 overflow-hidden rounded-lg bg-gradient-to-r p-6 text-gray-950">
				<div className="absolute top-0 right-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 transform rounded-full bg-white/10"></div>
				<div className="mb-2 text-2xl font-bold">Plan Professionnel</div>
				<div>Votre abonnement expire dans 18 jours</div>

				<div className="mt-5 flex justify-between space-x-4">
					<div className="rounded-lg bg-white/20 p-3 text-center">
						<div className="text-lg font-semibold">500 Go</div>
						<div className="text-xs opacity-80">Stockage</div>
					</div>
					<div className="rounded-lg bg-white/20 p-3 text-center">
						<div className="text-lg font-semibold">10 000</div>
						<div className="text-xs opacity-80">Requêtes API/mois</div>
					</div>
					<div className="rounded-lg bg-white/20 p-3 text-center">
						<div className="text-lg font-semibold">Illimité</div>
						<div className="text-xs opacity-80">Documents</div>
					</div>
					<div className="rounded-lg bg-white/20 p-3 text-center">
						<div className="text-lg font-semibold">29€</div>
						<div className="text-xs opacity-80">/mois</div>
					</div>
				</div>

				<button
					type="button"
					className="mt-5 flex items-center rounded-lg bg-white/20 px-4 py-2 text-white"
				>
					<i className="fas fa-arrow-up mr-2"></i> Mettre à niveau
				</button>
			</div>

			{/* Stats Grid */}
			<div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
				{/* Documents Stats */}
				<div className="flex flex-col rounded-lg bg-white p-5 shadow-sm">
					<div className="mb-5 flex items-center justify-between">
						<div className="text-sm text-slate-500">Documents créés</div>
						<div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg text-white">
							<i className="fas fa-file-alt"></i>
						</div>
					</div>
					<div className="mb-1 text-3xl font-bold">128</div>
					<div className="text-sm text-slate-500">
						+12% par rapport au mois dernier
					</div>
				</div>

				{/* API Stats */}
				<div className="flex flex-col rounded-lg bg-white p-5 shadow-sm">
					<div className="mb-5 flex items-center justify-between">
						<div className="text-sm text-slate-500">Utilisation API</div>
						<div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-lg text-white">
							<i className="fas fa-code"></i>
						</div>
					</div>
					<div className="mb-1 text-3xl font-bold">5,384</div>
					<div className="text-sm text-slate-500">Requêtes ce mois-ci</div>
				</div>

				{/* Storage Stats */}
				<div className="flex flex-col rounded-lg bg-white p-5 shadow-sm">
					<div className="mb-5 flex items-center justify-between">
						<div className="text-sm text-slate-500">Stockage utilisé</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white">
							<i className="fas fa-database"></i>
						</div>
					</div>
					<div className="mb-1 text-3xl font-bold">189 Go</div>
					<div className="text-sm text-slate-500">37.8% de votre quota</div>
				</div>

				{/* Payment Stats */}
				<div className="flex flex-col rounded-lg bg-white p-5 shadow-sm">
					<div className="mb-5 flex items-center justify-between">
						<div className="text-sm text-slate-500">Prochain paiement</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 text-white">
							<i className="fas fa-calendar"></i>
						</div>
					</div>
					<div className="mb-1 text-3xl font-bold">15/03/2025</div>
					<div className="text-sm text-slate-500">29€ - Plan Professionnel</div>
				</div>
			</div>

			{/* Services Section  */}
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold">Services disponibles</h2>
				<a
					href="#"
					className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
				>
					Voir tout
				</a>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{/* Document Service */}
				<div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-md">
					<div className="from-primary to-secondary flex h-32 items-center justify-center bg-gradient-to-r text-4xl text-white">
						<i className="fas fa-file-alt"></i>
					</div>
					<div className="p-4">
						<h3 className="mb-2 font-semibold">Traducteur de documents</h3>
						<p className="mb-4 text-sm text-slate-500">
							Convertissez vos documents en ligne avec support de plusieurs
							types de langues
						</p>
						<span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-1 text-xs">
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
				<div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-md">
					<div className="from-primary to-secondary flex h-32 items-center justify-center bg-gradient-to-r text-4xl text-white">
						<i className="fas fa-file-pdf"></i>
					</div>
					<div className="p-4">
						<h3 className="mb-2 font-semibold">Convertisseur de documents</h3>
						<p className="mb-4 text-sm text-slate-500">
							Convertissez vos documents dans différents formats en quelques
							clics
						</p>
					</div>
				</div>

				{/* CV Service */}
				<div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-md">
					<div className="from-primary to-secondary flex h-32 items-center justify-center bg-gradient-to-r text-4xl text-white">
						<i className="fas fa-id-card"></i>
					</div>
					<div className="p-4">
						<h3 className="mb-2 font-semibold">Générateur de CV</h3>
						<p className="mb-4 text-sm text-slate-500">
							Créez des CV professionnels avec nos modèles optimisés pour les
							recruteurs
						</p>
					</div>
				</div>
			</div>

			{/* Settings Section  */}
			<div className="mb-8 rounded-lg bg-white p-5 shadow-sm">
				<h2 className="mb-4 text-lg font-semibold">Paramètres du compte</h2>

				<div>
					{/* Email Notifications */}
					<div className="flex items-center justify-between border-b border-slate-200 py-4">
						<div className="max-w-3/4">
							<div className="mb-1 font-medium">Notifications par email</div>
							<div className="text-sm text-slate-500">
								Recevez des mises à jour sur vos documents, votre abonnement et
								les nouvelles fonctionnalités
							</div>
						</div>
						<label className="relative inline-block h-6 w-12">
							<input type="checkbox" className="h-0 w-0 opacity-0" checked />
							<span className="checked:bg-primary absolute top-0 right-0 bottom-0 left-0 cursor-pointer rounded-full bg-slate-200 transition-all duration-400 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-400 before:content-[''] checked:before:translate-x-6 checked:before:transform"></span>
						</label>
					</div>

					{/* 2FA */}
					<div className="flex items-center justify-between border-b border-slate-200 py-4">
						<div className="max-w-3/4">
							<div className="mb-1 font-medium">
								Authentification à deux facteurs
							</div>
							<div className="text-sm text-slate-500">
								Ajouter une couche supplémentaire de sécurité à votre compte
							</div>
						</div>
						<label className="relative inline-block h-6 w-12">
							<input type="checkbox" className="h-0 w-0 opacity-0" />
							<span className="checked:bg-primary absolute top-0 right-0 bottom-0 left-0 cursor-pointer rounded-full bg-slate-200 transition-all duration-400 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-400 before:content-[''] checked:before:translate-x-6 checked:before:transform"></span>
						</label>
					</div>

					{/* Dark Mode */}
					<div className="flex items-center justify-between py-4">
						<div className="max-w-3/4">
							<div className="mb-1 font-medium">Mode sombre</div>
							<div className="text-sm text-slate-500">
								Changer l'apparence de l'interface pour réduire la fatigue
								oculaire
							</div>
						</div>
						<label className="relative inline-block h-6 w-12">
							<input type="checkbox" className="h-0 w-0 opacity-0" />
							<span className="checked:bg-primary absolute top-0 right-0 bottom-0 left-0 cursor-pointer rounded-full bg-slate-200 transition-all duration-400 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-400 before:content-[''] checked:before:translate-x-6 checked:before:transform"></span>
						</label>
					</div>
				</div>
			</div>

			{/* Plans Section */}
			<div className="rounded-lg bg-white p-5 shadow-sm">
				<h2 className="mb-4 text-lg font-semibold">Options d'abonnement</h2>

				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead>
							<tr>
								<th className="bg-slate-50 px-4 py-4 text-left font-semibold">
									Plan
								</th>
								<th className="bg-slate-50 px-4 py-4 text-left font-semibold">
									Stockage
								</th>
								<th className="bg-slate-50 px-4 py-4 text-left font-semibold">
									Requêtes API
								</th>
								<th className="bg-slate-50 px-4 py-4 text-left font-semibold">
									Documents
								</th>
								<th className="bg-slate-50 px-4 py-4 text-left font-semibold">
									Prix
								</th>
								<th className="bg-slate-50 px-4 py-4 text-left font-semibold">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{/* Free Plan */}
							<tr>
								<td className="border-b border-slate-200 px-4 py-4 font-medium">
									Gratuit
								</td>
								<td className="border-b border-slate-200 px-4 py-4">5 Go</td>
								<td className="border-b border-slate-200 px-4 py-4">
									500 / mois
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									5 actifs
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									<div className="text-primary text-xl font-bold">0€</div>
									<div className="text-sm text-slate-500">Pour toujours</div>
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									<button
										type="button"
										className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
									>
										Rétrograder
									</button>
								</td>
							</tr>

							{/* Pro Plan */}
							<tr className="bg-secondary/5">
								<td className="border-b border-slate-200 px-4 py-4 font-medium">
									Professionnel
								</td>
								<td className="border-b border-slate-200 px-4 py-4">500 Go</td>
								<td className="border-b border-slate-200 px-4 py-4">
									10 000 / mois
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									Illimité
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									<div className="text-primary text-xl font-bold">29€</div>
									<div className="text-sm text-slate-500">Par mois</div>
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									<button
										type="button"
										className="bg-primary rounded-lg px-4 py-2 text-sm text-white"
										disabled
									>
										Plan actuel
									</button>
								</td>
							</tr>

							{/* Enterprise Plan */}
							<tr>
								<td className="border-b border-slate-200 px-4 py-4 font-medium">
									Entreprise
								</td>
								<td className="border-b border-slate-200 px-4 py-4">2 To</td>
								<td className="border-b border-slate-200 px-4 py-4">
									100 000 / mois
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									Illimité
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									<div className="text-primary text-xl font-bold">99€</div>
									<div className="text-sm text-slate-500">Par mois</div>
								</td>
								<td className="border-b border-slate-200 px-4 py-4">
									<button
										type="button"
										className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
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
	);
};

export default Dashboard;
