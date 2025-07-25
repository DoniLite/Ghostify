const locales = {
	common: {
		home: 'Inicio',
		contact: 'Contacto',
		pricing: 'Precios',
		documentation: 'Documentación',
		login: 'Iniciar sesión',
		github: 'Github',
		loading: 'Cargando...',
		google: 'Google',
		get_started: 'Empezar',
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
				'Ghostify es una plataforma de creación y compartición de contenido, que incluye servicios como la creación y conversión de documentos y currículums.',
			cta: {
				'1': 'Probar gratis',
				'2': 'Ver documentación',
			},
		},
		services: {
			id: 'Nuestros Servicios',
			title: 'Soluciones completas de documentación para desarrolladores',
			description:
				'Integra funciones avanzadas de gestión documental en tus aplicaciones con nuestras APIs de alto rendimiento y escalabilidad.',
			translation_service: {
				title: 'Traducción y creación de documentos',
				description:
					'Traduce tus documentos a diferentes formatos y crea documentos de trabajo para colaborar con tu equipo.',
				fields: [
					'Rendimiento y optimización',
					'Formatos PDF, DOCX, HTML',
					'Traducción y creación masiva',
				],
			},
			conversion_service: {
				title: 'Conversión de documentos',
				description:
					'Convierte tus documentos entre diferentes formatos conservando el diseño y los elementos complejos.',
				fields: [
					'PDF, DOCX, HTML, Markdown',
					'Preservación del diseño',
					'Procesamiento por lotes',
				],
			},
			cv_service: {
				title: 'Creación de currículums',
				description:
					'Genera currículums profesionales con plantillas personalizables para aplicaciones de RRHH y sitios de empleo.',
				fields: ['Plantillas modernas', 'Personalización avanzada'],
			},
		},
		cta: {
			first_cta: {
				title: 'Lanza tu carrera profesional',
				description:
					'Crea ahora un currículum de alta calidad, adaptado a tus necesidades y al mercado, gracias a nuestro generador personalizable. También puedes generarlos en masa o integrar nuestra API en tus propias soluciones.',
				btns: {
					1: 'Descubrir',
					2: 'Saber más',
				},
			},
			second_cta: {
				title: 'Soportamos más de 30 tipos de documentos',
				description:
					'Nuestro software de conversión permite obtener resultados satisfactorios independientemente del formato de entrada o salida. Gracias a herramientas potentes, preservamos el formato y la calidad original de tus documentos. También puedes convertirlos en masa o usar nuestra API.',
				btn: 'Probar gratis',
			},
		},
		productivity: {
			title: 'Todo lo que necesitas para aumentar tu productividad',
			description:
				'Ghostify es una plataforma de productividad que te permite inspirarte en contenido de otros usuarios y beneficiarte de asistencia IA adaptada a tus preferencias.',
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
			get_started: 'Empezar',
			login: 'Iniciar sesión',
		},
	},
	billing: {
		pro: {
			id: 'Pro',
			pack: [
				'Kit básico: Creación de documentos, 30 GB de almacenamiento gratuito, Espacio de equipo (5 espacios, 10 conexiones máx)',
				'Conversión ilimitada de documentos',
				'50k tokens/mes para traducción de documentos',
				'Creación ilimitada de currículums',
				'Currículums alojados y compartibles',
			],
		},
		stater: {
			id: 'Starter',
			pack: [
				'Kit básico: Creación de documentos, 15 GB de almacenamiento gratuito, Espacio de equipo (2 espacios, 5 conexiones máx)',
				'Conversión de 10 GB/mes',
				'Creación ilimitada de currículums',
				'Currículums alojados y compartibles',
			],
		},
	},
	contact: {
		title: 'Contáctanos',
		subtitle:
			'¡Nos encantaría saber de ti! Envíanos un mensaje o consulta nuestros datos de contacto a continuación.',
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
		form_heading: 'Iniciar sesión en tu cuenta',
		form: {
			login: {
				label: 'Usuario',
				placeholder: 'Ingresa tu correo o nombre de usuario.',
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
		form_success: '¡Inicio de sesión exitoso! Redireccionando...',
		form_error: 'Error al iniciar sesión. Verifica tus credenciales.',
	},
	footer: {},
	not_found: {},
};

export default locales;
