const locales = {
	common: {
		home: 'Inicio',
		contact: 'Contacto',
		pricing: 'Precios',
		documentation: 'Documentación',
		login: 'Iniciar sesión',
		register: 'Registrarse',
		github: 'Github',
		loading: 'Cargando...',
		google: 'Google',
		get_started: 'Comenzar',
		per: 'Por',
		month: 'Mes',
		year: 'Año',
		day: 'Día',
		mode: {
			system: 'Modo del sistema',
			light: 'Modo claro',
			dark: 'Modo oscuro',
		},
	},
	home: {
		hero: {
			welcome_1: 'Una plataforma para impulsar tu',
			welcome_2: 'productividad',
			description:
				'Ghostify es una plataforma para crear y compartir contenido, que incluye servicios como creación y conversión de documentos y currículums.',
			cta: {
				'1': 'Probar gratis',
				'2': 'Ver documentación',
			},
		},
		services: {
			id: 'Nuestros Servicios',
			title: 'Soluciones completas de documentación para desarrolladores',
			description:
				'Integra funciones avanzadas de gestión de documentos en tus aplicaciones con nuestras APIs potentes y escalables.',
			translation_service: {
				title: 'Traducción y creación de documentos',
				description:
					'Traduce tus documentos a diferentes formatos, crea documentos colaborativos para trabajar con tu equipo.',
				fields: [
					'Rendimiento y optimización',
					'Formatos PDF, DOCX, HTML',
					'Traducción y creación masiva',
				],
			},
			conversion_service: {
				title: 'Conversión de documentos',
				description:
					'Convierte tus documentos entre diferentes formatos manteniendo el formato y los elementos complejos.',
				fields: [
					'PDF, DOCX, HTML, Markdown',
					'Preservación del diseño',
					'Procesamiento por lotes',
				],
			},
			cv_service: {
				title: 'Creación de currículums',
				description:
					'Genera currículums profesionales con plantillas personalizables para apps de RRHH y sitios de empleo.',
				fields: ['Plantillas modernas', 'Personalización avanzada'],
			},
		},
		cta: {
			first_cta: {
				title: 'Lanza tu carrera profesional',
				description:
					'Crea un currículum de alta calidad ahora mismo, adaptado a tus necesidades y al mercado, con nuestro generador de CV. Puedes personalizarlo, crearlo en masa o usar nuestra API para integrarlo en tus soluciones.',
				btns: {
					1: 'Descubrir',
					2: 'Saber más',
				},
			},
			second_cta: {
				title: 'Soportamos más de 30 tipos de documentos',
				description:
					'Nuestro software de conversión garantiza resultados óptimos sin importar el formato de entrada o salida. Gracias a herramientas potentes, preservamos el formato y la calidad original. También puedes convertir en masa o usar nuestra API.',
				btn: 'Probar gratis',
			},
		},
		productivity: {
			title: 'Todo lo que necesitas para aumentar tu productividad',
			description:
				'Ghostify es una plataforma de productividad que te permite inspirarte en el contenido de otros y beneficiarte de la ayuda de la IA para tus tareas, respetando tus preferencias.',
		},
		open_source: {
			title: {
				1: 'somos',
				2: 'Open Source',
			},
			btn: 'Ver en Github',
		},
	},
	header: {
		buttons: {
			get_started: 'Comenzar',
			login: 'Iniciar sesión',
		},
	},
	billing: {
		pro: {
			id: 'Pro',
			pack: [
				'Kit básico de documentos: creación, 30GB de almacenamiento gratuito, colaboración en equipo (5 espacios, 10 conexiones máx.)',
				'Conversión de documentos ilimitada',
				'50k tokens/mes para traducción de documentos',
				'Creación de currículums ilimitada',
				'Currículum alojado y compartible',
			],
		},
		stater: {
			id: 'Inicial',
			pack: [
				'Kit básico: creación de documentos, 15GB de almacenamiento, colaboración en equipo (2 espacios, 5 conexiones máx.)',
				'10GB/mes de conversión de documentos',
				'Creación de currículums ilimitada',
				'Currículum alojado y compartible',
			],
		},
	},
	contact: {
		title: 'Ponte en contacto',
		subtitle:
			'¡Nos encantaría saber de ti! Envíanos un mensaje o encuentra nuestros datos de contacto abajo.',
		form_heading: 'Envíanos un mensaje',
		form_name: 'Tu nombre',
		form_email: 'Tu correo electrónico',
		form_subject: 'Asunto',
		form_message: 'Tu mensaje',
		form_submit: 'Enviar mensaje',
		form_sending: 'Enviando...',
		form_success: '¡Mensaje enviado con éxito! Te responderemos pronto.',
		form_error: 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.',
	},
	login: {
		subtitle: 'Accede a tu cuenta',
		form_heading: 'Inicia sesión en tu cuenta',
		form: {
			login: {
				label: 'Usuario',
				placeholder: 'Ingresa tu correo/usuario.',
			},
			password: {
				label: 'Contraseña',
				placeholder: 'Ingresa tu contraseña.',
			},
		},
		form_submit: 'Enviar',
		form_forgot_password: '¿Olvidaste tu contraseña?',
		form_create_account: 'Crear una cuenta',
		form_sending: 'Iniciando sesión...',
	},
	register: {
		form_heading: 'Crea una nueva cuenta en Ghostify',
		form: {
			email: {
				label: 'Correo electrónico',
				placeholder: 'Ingresa tu correo',
			},
			password: {
				label: 'Contraseña',
				placeholder: 'Ingresa una contraseña',
			},
			validate_password: {
				label: 'Confirmar contraseña',
				placeholder: 'Confirma tu contraseña',
			},
		},
		form_login_account: '¿Ya tienes una cuenta? Inicia sesión',
		password_field_error: 'Las contraseñas deben coincidir',
	},
	footer: {},
	not_found: {},
};

export default locales;
