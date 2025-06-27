import { useTranslation } from '../shared/TranslationContext'
import { Button } from '../utils/button'

const HeroSection = () => {
  const { t } = useTranslation()
  return (
    <section className="bg-background relative flex h-screen items-center justify-center px-6 pt-24 pb-12 lg:px-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-12 lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-foreground font-nunito mb-6 text-4xl leading-tight font-extrabold lg:text-6xl">
            {t('home.hero.welcome_1')}{' '}
            <span className="text-primary">{t('home.hero.welcome_2')}</span>
          </h1>
          <p className="text-muted-foreground font-inter mx-auto mb-8 max-w-xl text-lg lg:mx-0 lg:text-xl">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Button className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-nunito cursor-pointer rounded-md px-8 py-3 text-lg transition-colors">
              {t('home.hero.cta.1')}
            </Button>
            <Button className="border-border text-foreground hover:bg-muted font-nunito cursor-pointer rounded-md border px-8 py-3 text-lg transition-colors">
              {t('home.hero.cta.2')}
            </Button>
          </div>
        </div>

        <div className="floating relative md:w-5/12">
          <div className="bg-card border-border relative overflow-hidden rounded-xl border shadow-xl">
            <div className="flex h-8 items-center px-4">
              <div className="flex space-x-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="bg-muted p-4">
              <div className="glass border-border rounded-lg border p-4">
                <div className="mb-4 flex space-x-2">
                  <div className="bg-primary rounded-md px-2 py-1 text-xs font-medium">
                    Create
                  </div>
                  <div className="bg-primary/10 rounded-md px-2 py-1 text-xs font-medium">
                    Convert
                  </div>
                  <div className="bg-primary/20 rounded-md px-2 py-1 text-xs font-medium">
                    CV
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-secondary h-5 w-3/4 rounded"></div>
                  <div className="bg-secondary h-5 rounded"></div>
                  <div className="bg-secondary h-5 w-5/6 rounded"></div>
                  <div className="bg-secondary mt-4 h-20 rounded"></div>
                </div>
                <div className="border-border mt-4 border-t pt-4 pb-2">
                  <div className="bg-primary h-8 w-full rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 opacity-20 mix-blend-multiply blur-3xl filter"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
