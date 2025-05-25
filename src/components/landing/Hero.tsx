import { Button } from '../utils/button.tsx';

const HeroSection = () => {
  return (
    <section className='relative h-screen flex items-center justify-center pt-24 pb-12 px-6 lg:px-12 bg-background'>
      <div className='container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12'>
        <div className='flex-1 text-center lg:text-left'>
          <h1 className='text-4xl lg:text-6xl font-extrabold leading-tight text-foreground mb-6 font-nunito'>
            Une plateforme pour booster votre{' '}
            <span className='text-primary'>
              productivité
            </span>
          </h1>
          <p className='text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 font-inter'>
            Ghostify est une plateforme de production et de partage de contenu,
            incluant des services comme la création et la conversion de document
            et de Cirruculum Vitae.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
            <Button className='bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg hover:bg-accent transition-colors font-nunito'>
              Essayer gratuitement
            </Button>
            <Button className='border border-input text-foreground px-8 py-3 rounded-md text-lg hover:bg-muted transition-colors font-nunito'>
              Consulter la doc
            </Button>
          </div>
        </div>

        <div className='md:w-5/12 floating relative'>
          <div className='relative bg-card rounded-xl overflow-hidden border border-border shadow-xl'>
            <div className='h-8 flex items-center px-4'>
              <div className='flex space-x-1.5'>
                <div className='w-3 h-3 rounded-full bg-red-500'></div>
                <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                <div className='w-3 h-3 rounded-full bg-green-500'></div>
              </div>
            </div>
            <div className='p-4 bg-muted'>
              <div className='glass rounded-lg p-4 border border-border'>
                <div className='flex space-x-2 mb-4'>
                  <div className='px-2 py-1 rounded-md bg-primary text-xs font-medium'>
                    Create
                  </div>
                  <div className='px-2 py-1 rounded-md bg-primary/10 text-xs font-medium'>
                    Convert
                  </div>
                  <div className='px-2 py-1 rounded-md bg-primary/20 text-xs font-medium'>
                    CV
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='h-5 bg-secondary rounded w-3/4'></div>
                  <div className='h-5 bg-secondary rounded'></div>
                  <div className='h-5 bg-secondary rounded w-5/6'></div>
                  <div className='h-20 bg-secondary rounded mt-4'></div>
                </div>
                <div className='mt-4 pb-2 border-t border-border pt-4'>
                  <div className='h-8 w-full rounded-md bg-primary'>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20'>
          </div>
          <div className='absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20'>
          </div>
        </div>


      </div>
    </section>
  );
};

export default HeroSection;
