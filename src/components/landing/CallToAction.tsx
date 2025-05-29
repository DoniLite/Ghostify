import { useTranslation } from '../shared/TranslationContext.tsx';
import { Button } from '../utils/button.tsx';

const CtaSection = () => {
  const { t } = useTranslation();
  return (
    <section className='py-20 px-6 lg:px-12 bg-background text-foreground'>
      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
        {/* Section 1: Launch your professional career */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
          <h2 className='text-4xl lg:text-5xl font-extrabold mb-6 font-nunito'>
            {t('home.cta.first_cta.title')}
          </h2>
          <p className='text-lg text-muted-foreground mb-8 font-inter'>
            {t('home.cta.first_cta.description')}
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Button className='bg-primary text-primary-foreground cursor-pointer px-8 py-3 rounded-md text-lg hover:bg-accent transition-colors font-nunito'>
              {t('home.cta.first_cta.btns.1')}
            </Button>
            <Button className='border border-border cursor-pointer text-foreground px-8 py-3 rounded-md text-lg hover:bg-muted transition-colors font-nunito'>
              {t('home.cta.first_cta.btns.2')}
            </Button>
          </div>
        </div>

        {/* Section 2: Document Conversion Support */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
          <h2 className='text-4xl lg:text-5xl font-extrabold mb-6 font-nunito'>
            {t('home.cta.second_cta.title')}
          </h2>
          <p className='text-lg text-muted-foreground mb-8 font-inter'>
            {t('home.cta.second_cta.description')}
          </p>
          <Button className='bg-primary cursor-pointer text-primary-foreground px-8 py-3 rounded-md text-lg hover:bg-accent transition-colors font-nunito'>
            {t('home.cta.second_cta.btn')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
