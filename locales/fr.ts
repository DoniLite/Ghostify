const locales = {
	common: {
		home: 'Accueil',
		contact: 'Contact',
		pricing: 'Tarification',
		documentation: 'Documentation',
		login: 'Connexion',
		github: 'Github',
		loading: 'Chargement...',
		google: 'Google',
		get_started: 'Commencer',
		per: 'Par',
		month: 'Mois',
		year: 'Année',
		day: 'Jour',
		mode: {
			system: 'Mode Système',
			light: 'Mode Clair',
			dark: 'Mode Sombre',
		},
	},
	home: {
		hero: {
			welcome_1: 'Une plateforme pour booster votre',
			welcome_2: 'productivité',
			description:
				'Ghostify est une plateforme de production et de partage de contenu, incluant des services tels que la création et la conversion de documents et de CV.',
			cta: {
				'1': 'Essayer gratuitement',
				'2': 'Voir la documentation',
			},
		},
		services: {
			id: 'Nos Services',
			title: 'Solutions complètes de documentation pour développeurs',
			description:
				'Intégrez des fonctionnalités avancées de gestion documentaire dans vos applications grâce à nos API performantes et évolutives.',
			translation_service: {
				title: 'Traduction et création de documents',
				description:
					'Traduisez vos documents dans différents formats, créez des documents de travail pour collaborer avec votre équipe.',
				fields: [
					'Performance et optimisation',
					'Formats PDF, DOCX, HTML',
					'Traduction et création en masse',
				],
			},
			conversion_service: {
				title: 'Conversion de documents',
				description:
					'Convertissez vos documents entre différents formats tout en conservant la mise en page et les éléments complexes.',
				fields: [
					'PDF, DOCX, HTML, Markdown',
					'Conservation de la mise en page',
					'Traitement par lot',
				],
			},
			cv_service: {
				title: 'Création de CV',
				description:
					'Générez des CV professionnels avec des modèles personnalisables pour les applications RH et les sites de recrutement.',
				fields: ['Modèles modernes', 'Personnalisation avancée'],
			},
		},
		cta: {
			first_cta: {
				title: 'Lancez votre carrière professionnelle',
				description:
					'Créez dès maintenant un CV de qualité, adapté à vos besoins et au marché, grâce à notre générateur personnalisable. Vous pouvez aussi les générer en masse ou intégrer notre API dans vos propres solutions.',
				btns: {
					1: 'Découvrir',
					2: 'En savoir plus',
				},
			},
			second_cta: {
				title: 'Nous prenons en charge +30 types de documents',
				description:
					'Notre logiciel de conversion vous permet d’obtenir des résultats satisfaisants quel que soit le format d’entrée ou de sortie. Grâce à des outils puissants, nous préservons la mise en page et la qualité originale de vos documents. Conversion en masse ou via notre API.',
				btn: 'Essayer gratuitement',
			},
		},
		productivity: {
			title: 'Tout ce dont vous avez besoin pour booster votre productivité',
			description:
				"Ghostify est une plateforme de productivité qui vous permet de vous inspirer du contenu d'autres utilisateurs, tout en bénéficiant d'une aide IA adaptée à vos préférences.",
		},
		open_source: {
			title: {
				1: 'nous sommes',
				2: 'Open Source',
			},
			btn: 'Voir sur Github',
		},
	},
	header: {
		buttons: {
			get_started: 'Commencer',
			login: 'Connexion',
		},
	},
	billing: {
		pro: {
			id: 'Pro',
			pack: [
				'Kit de base : Création de documents, 30 Go de stockage gratuit, Partage en équipe (5 espaces, 10 connexions max)',
				'Convertisseur de documents illimité',
				'50k tokens/mois pour la traduction de documents',
				'Création de CV illimitée',
				'CV hébergés et partageables',
			],
		},
		stater: {
			id: 'Starter',
			pack: [
				'Kit de base : Création de documents, 15 Go de stockage gratuit, Partage en équipe (2 espaces, 5 connexions max)',
				'Convertisseur 10 Go/mois',
				'Création de CV illimitée',
				'CV hébergés et partageables',
			],
		},
	},
	contact: {
		title: 'Contactez-nous',
		subtitle:
			'Nous serions ravis de vous lire ! Envoyez-nous un message ou trouvez nos coordonnées ci-dessous.',
		form_heading: 'Envoyez-nous un message',
		form_name: 'Votre nom',
		form_email: 'Votre e-mail',
		form_subject: 'Sujet',
		form_message: 'Votre message',
		form_submit: 'Envoyer le message',
		form_sending: 'Envoi en cours...',
		form_success: 'Message envoyé avec succès ! Nous vous répondrons bientôt.',
		form_error: "Échec de l'envoi. Veuillez réessayer plus tard.",
	},
	login: {
		subtitle: 'Accédez à votre compte',
		form_heading: 'Connexion à votre compte',
		form: {
			login: {
				label: 'Identifiant',
				placeholder: 'Entrez votre email/nom d’utilisateur.',
			},
			password: {
				label: 'Mot de passe',
				placeholder: 'Entrez votre mot de passe.',
			},
		},
		form_submit: 'Soumettre',
		form_forgot_password: 'Mot de passe oublié ?',
		form_create_account: 'Créer un compte',
		form_sending: 'Connexion...',
		form_success: 'Connexion réussie ! Redirection...',
		form_error: 'Échec de la connexion. Vérifiez vos identifiants.',
	},
	footer: {},
	not_found: {},
};

export default locales;
