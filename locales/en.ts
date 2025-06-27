const locales = {
	common: {
		home: 'Home',
		contact: 'Contact',
		pricing: 'Pricing',
		products: 'Products',
		get_started: 'Get started',
		per: 'By',
		month: 'Month',
		year: 'Year',
		day: 'Day',
		mode: {
			system: 'System Mode',
			light: 'Light Mode',
			dark: 'Dark Mode',
		},
	},
	home: {
		hero: {
			welcome_1: 'A platform to boost your',
			welcome_2: 'productivity',
			description:
				'Ghostify is a content production and sharing platform, including services such as document and Resume creation and conversion.',
			cta: {
				'1': 'Try for free',
				'2': 'View documentation',
			},
		},
		services: {
			id: 'Our Services',
			title: 'Complete documentation solutions for developers',
			description:
				'Integrate advanced document management features into your applications with our high-performance and scalable APIs.',
			translation_service: {
				title: 'Documents translation and creation',
				description:
					'Translate your documents into different types of formats, create working documents to collaborate with your team.',
				fields: [
					'Performance and optimization',
					'PDF, DOCX, HTML formats',
					'Mass translation and creation',
				],
			},
			conversion_service: {
				title: 'Documents conversion',
				description:
					'Convert your documents between different formats while preserving formatting and complex elements.',
				fields: [
					'PDF, DOCX, HTML, Markdown',
					'Preserving the layout',
					'Batch processing',
				],
			},
			cv_service: {
				title: 'Resume Creation',
				description:
					'Generate professional resumes with customizable templates for HR apps and recruiting websites.',
				fields: ['Modern templates', 'Advanced customization'],
			},
		},
		cta: {
			first_cta: {
				title: 'Launch your professional career',
				description:
					'Create a high-quality resume now, tailored to your needs and the market, thanks to our resume generator, which gives you the option to customize your resume. You can also choose to create them in bulk or use our API if you want to integrate it into your own solutions.',
				btns: {
					1: 'Discover',
					2: 'Learn more',
				},
			},
			second_cta: {
				title: 'We support +30 document types in terms of conversion',
				description:
					'Our conversion software allows you to achieve satisfactory results regardless of your desired input or output. Thanks to powerful tools, we preserve the format and original quality of your documents. You can also choose to convert them in bulk or use our API if you wish to integrate it into your own solutions.',
				btn: 'Try for free',
			},
		},
		productivity: {
			title: 'Everything you need to boost your productivity',
			description:
				"Ghostify is a productivity platform that allows you to draw inspiration not only from other users' content but also to benefit from AI assistance for your various tasks while taking into account your preferences.",
		},
		open_source: {
			title: {
				1: 'we are',
				2: 'Open Source',
			},
			btn: 'View on Github',
		},
	},
	header: {
		buttons: {
			get_started: 'Get started',
			login: 'Login',
		},
	},
	billing: {
		pro: {
			id: 'Pro',
			pack: [
				'Document basic toolkit: Creation, 30GB free Storage, Team workspace sharing (5 workspaces, 10 max connections)',
				'Unlimited Document Convertor',
				'50k token/mo Document Translator',
				'Unlimited Resume creation',
				'Hosted and Sharable Resume',
			],
		},
		stater: {
			id: 'Starter',
			pack: [
				'Document basic toolkit: Creation, 15GB free Storage, Team workspace sharing (2 workspace, 5 max connections)',
				'10GB/mo Documents Convertor',
				'Unlimited Resume creation',
				'Hosted and Sharable Resume',
			],
		},
	},
	contact: {
		title: 'Get in Touch',
		subtitle:
			"We'd love to hear from you! Send us a message or find our contact details below.",
		form_heading: 'Send us a Message',
		form_name: 'Your Name',
		form_email: 'Your Email',
		form_subject: 'Subject',
		form_message: 'Your Message',
		form_submit: 'Send Message',
		form_sending: 'Sending...',
		form_success: "Message sent successfully! We'll get back to you soon.",
		form_error: 'Failed to send message. Please try again later.',
	},
	footer: {},
	not_found: {},
};

export default locales;
