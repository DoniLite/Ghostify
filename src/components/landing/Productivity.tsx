import { useTranslation } from '../shared/TranslationContext.tsx';

const ProductivitySection = () => {
  const { t } = useTranslation();
  return (
    <section className='py-20 px-6 lg:px-12 bg-background text-foreground text-center'>
      <div className='container mx-auto'>
        <div className='bg-card p-10 rounded-xl shadow-lg border border-border flex flex-col lg:flex-row items-center justify-between gap-8'>
          <h2 className='text-4xl lg:text-5xl font-extrabold text-primary font-nunito lg:w-1/2 text-center lg:text-left'>
            {t('home.productivity.title')}
          </h2>
          <p className='text-lg text-muted-foreground lg:w-1/2 text-center lg:text-right font-inter'>
            {t('home.productivity.description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductivitySection;
