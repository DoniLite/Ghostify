import { useTranslation } from '../shared/TranslationContext';
import { Button } from '../utils/button';

const CtaSection = () => {
	const { t } = useTranslation();
	return (
		<section className="bg-background text-foreground px-6 py-20 lg:px-12">
			<div className="container mx-auto grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
				{/* Section 1: Launch your professional career */}
				<div className="flex flex-col items-center text-center lg:items-start lg:text-left">
					<h2 className="font-nunito mb-6 text-4xl font-extrabold lg:text-5xl">
						{t('home.cta.first_cta.title')}
					</h2>
					<p className="text-muted-foreground font-inter mb-8 text-lg">
						{t('home.cta.first_cta.description')}
					</p>
					<div className="flex flex-col gap-4 sm:flex-row">
						<Button className="bg-primary text-primary-foreground hover:bg-accent font-nunito cursor-pointer rounded-md px-8 py-3 text-lg transition-colors">
							{t('home.cta.first_cta.btns.1')}
						</Button>
						<Button className="border-border text-foreground hover:bg-muted font-nunito cursor-pointer rounded-md border px-8 py-3 text-lg transition-colors">
							{t('home.cta.first_cta.btns.2')}
						</Button>
					</div>
				</div>

				{/* Section 2: Document Conversion Support */}
				<div className="flex flex-col items-center text-center lg:items-start lg:text-left">
					<h2 className="font-nunito mb-6 text-4xl font-extrabold lg:text-5xl">
						{t('home.cta.second_cta.title')}
					</h2>
					<p className="text-muted-foreground font-inter mb-8 text-lg">
						{t('home.cta.second_cta.description')}
					</p>
					<Button className="bg-primary text-primary-foreground hover:bg-accent font-nunito cursor-pointer rounded-md px-8 py-3 text-lg transition-colors">
						{t('home.cta.second_cta.btn')}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default CtaSection;
