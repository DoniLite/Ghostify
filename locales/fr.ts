const locales = {
	common: {
		home: 'Accueil',
		contact: 'Contact',
		pricing: 'Tarification',
		documentation: 'Documentation',
		login: 'Connexion',
		register: 'Inscription',
		github: 'Github',
		loading: 'Chargement...',
		google: 'Google',
		get_started: 'Commencer',
		per: 'Par',
		month: 'Mois',
		year: 'An',
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
				'Ghostify est une plateforme de production et de partage de contenu, incluant des services de création et de conversion de documents et de CV.',
			cta: {
				'1': 'Essayer gratuitement',
				'2': 'Voir la documentation',
			},
		},
		services: {
			id: 'Nos Services',
			title: 'Solutions complètes de documentation pour développeurs',
			description:
				'Intégrez des fonctionnalités avancées de gestion de documents dans vos applications grâce à nos API performantes et évolutives.',
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
					'Convertissez vos documents entre différents formats tout en préservant la mise en page et les éléments complexes.',
				fields: [
					'PDF, DOCX, HTML, Markdown',
					'Préservation de la mise en page',
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
				title: 'Lance ta carrière professionnelle',
				description:
					'Crée dès maintenant un CV de qualité, adapté à tes besoins et au marché, grâce à notre générateur de CV. Tu peux le personnaliser, le créer en masse ou utiliser notre API pour l’intégrer à tes solutions.',
				btns: {
					1: 'Découvrir',
					2: 'En savoir plus',
				},
			},
			second_cta: {
				title: 'Nous prenons en charge +30 types de documents',
				description:
					'Notre logiciel de conversion vous garantit des résultats fiables quel que soit votre format d’entrée ou de sortie. Grâce à des outils puissants, nous préservons la qualité d’origine. Vous pouvez aussi convertir en masse ou utiliser notre API.',
				btn: 'Essayer gratuitement',
			},
		},
		productivity: {
			title: 'Tout ce qu’il faut pour booster ta productivité',
			description:
				'Ghostify est une plateforme de productivité qui t’aide à t’inspirer du contenu des autres, mais aussi à bénéficier de l’aide de l’IA pour tes tâches, selon tes préférences.',
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
				'Outils de base : Création de documents, 30 Go de stockage, partage en équipe (5 espaces de travail, 10 connexions max)',
				'Convertisseur de documents illimité',
				'50k jetons/mois pour la traduction',
				'Création de CV illimitée',
				'CV hébergé et partageable',
			],
		},
		stater: {
			id: 'Débutant',
			pack: [
				'Outils de base : Création, 15 Go de stockage, partage en équipe (2 espaces de travail, 5 connexions max)',
				'10 Go/mois de conversion',
				'Création de CV illimitée',
				'CV hébergé et partageable',
			],
		},
	},
	contact: {
		title: 'Contactez-nous',
		subtitle:
			'Nous serions ravis de vous lire ! Envoyez-nous un message ou trouvez nos coordonnées ci-dessous.',
		form_heading: 'Envoyez-nous un message',
		form_name: 'Votre nom',
		form_email: 'Votre email',
		form_subject: 'Sujet',
		form_message: 'Votre message',
		form_submit: 'Envoyer le message',
		form_sending: 'Envoi en cours...',
		form_success:
			'Message envoyé avec succès ! Nous reviendrons vers vous bientôt.',
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
		form_submit: 'Valider',
		form_forgot_password: 'Mot de passe oublié ?',
		form_create_account: 'Créer un compte',
		form_sending: 'Connexion en cours...',
	},
	register: {
		form_heading: 'Créer un nouveau compte sur Ghostify',
		form: {
			email: {
				label: 'Email',
				placeholder: 'Entrez votre email',
			},
			password: {
				label: 'Mot de passe',
				placeholder: 'Entrez un mot de passe',
			},
			validate_password: {
				label: 'Confirmez le mot de passe',
				placeholder: 'Confirmez votre mot de passe',
			},
		},
		form_login_account: 'Déjà inscrit ? Essayez de vous connecter',
		password_field_error: 'Les mots de passe doivent correspondre',
	},
	footer: {},
	not_found: {},
};

export default locales;
