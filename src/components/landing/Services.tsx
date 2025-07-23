import { FileText, Repeat2, UserCheck } from 'lucide-react'; // Assuming lucide-react for icons
import { useTranslation } from '../shared/TranslationContext';

type ServiceCardProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	features: string[];
	apiCode?: string;
};

const ServiceCard = ({
	icon,
	title,
	description,
	features,
	apiCode,
}: ServiceCardProps) => (
	<div className="bg-card border-border flex w-full flex-col items-start rounded-xl border p-8 text-left shadow-lg lg:w-1/3">
		<div className="text-primary mb-4">{icon}</div>
		<h3 className="text-foreground font-nunito mb-3 text-2xl font-bold">
			{title}
		</h3>
		<p className="text-muted-foreground font-inter mb-4">{description}</p>
		<ul className="text-muted-foreground font-inter mb-6 space-y-2 text-sm">
			{features.map((feature) => (
				<li key={feature} className="flex items-center">
					<svg
						className="mr-2 h-4 w-4 text-green-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Feature icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					{feature}
				</li>
			))}
		</ul>
		{apiCode && (
			<div className="bg-muted text-muted-foreground w-full overflow-auto rounded-md p-4 font-mono text-sm">
				<pre>{apiCode}</pre>
			</div>
		)}
	</div>
);

const ServicesSection = () => {
	const { t } = useTranslation();
	return (
		<section className="bg-background px-6 py-20 text-center lg:px-12">
			<div className="container mx-auto">
				<span className="text-primary font-nunito text-lg font-semibold">
					{t('home.services.id')}
				</span>
				<h2 className="text-foreground font-nunito mt-4 mb-12 text-4xl font-extrabold lg:text-5xl">
					{t('home.services.title')}
				</h2>
				<p className="text-muted-foreground font-inter mx-auto mb-16 max-w-2xl text-lg">
					{t('home.services.description')}
				</p>

				<div className="flex flex-col items-stretch justify-center gap-8 lg:flex-row">
					<ServiceCard
						icon={<FileText size={36} />}
						title={t('home.services.translation_service.title')}
						description={t('home.services.translation_service.description')}
						features={
							t(
								'home.services.translation_service.fields',
							) as unknown as string[]
						}
						apiCode={`POST /api/documents/translate\n{\n  "template": "invoice_v2",\n  "data": {\n    "client": "Acme Inc.",\n    "items": []\n  }\n}`}
					/>
					<ServiceCard
						icon={<Repeat2 size={36} />}
						title={t('home.services.conversion_service.title')}
						description={t('home.services.conversion_service.description')}
						features={
							t(
								'home.services.conversion_service.fields',
							) as unknown as string[]
						}
						apiCode={`POST /api/documents/convert\n{\n  "source": "pdf",\n  "target": "docx",\n  "options": {\n    "preserveImages": true\n  }\n}`}
					/>
					<ServiceCard
						icon={<UserCheck size={36} />}
						title={t('home.services.cv_service.title')}
						description={t('home.services.cv_service.description')}
						features={
							t('home.services.cv_service.fields') as unknown as string[]
						}
					/>
				</div>
			</div>
		</section>
	);
};

export default ServicesSection;
