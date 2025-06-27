import { useTranslation } from '../shared/TranslationContext'

const ProductivitySection = () => {
  const { t } = useTranslation()
  return (
    <section className="bg-background text-foreground px-6 py-20 text-center lg:px-12">
      <div className="container mx-auto">
        <div className="bg-card border-border flex flex-col items-center justify-between gap-8 rounded-xl border p-10 shadow-lg lg:flex-row">
          <h2 className="text-primary font-nunito text-center text-4xl font-extrabold lg:w-1/2 lg:text-left lg:text-5xl">
            {t('home.productivity.title')}
          </h2>
          <p className="text-muted-foreground font-inter text-center text-lg lg:w-1/2 lg:text-right">
            {t('home.productivity.description')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProductivitySection
