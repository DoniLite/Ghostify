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
        <div className='flex-1 flex justify-center lg:justify-end'>
          <div className='w-full max-w-lg bg-card rounded-xl p-6 shadow-lg border border-border'>
            {/* This is a simplified representation of the dashboard-like element */}
            <div className='flex items-center space-x-2 mb-4'>
              <span className='h-3 w-3 bg-red-500 rounded-full'></span>
              <span className='h-3 w-3 bg-yellow-500 rounded-full'></span>
              <span className='h-3 w-3 bg-green-500 rounded-full'></span>
            </div>
            <div className='flex space-x-3 mb-4'>
              <Button className='bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-nunito'>
                Create
              </Button>
              <Button className='bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-nunito'>
                Convert
              </Button>
              <Button className='bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-nunito'>
                CV
              </Button>
            </div>
            <div className='space-y-4'>
              <div className='h-8 bg-muted rounded-md w-full'></div>
              <div className='h-8 bg-muted rounded-md w-11/12'></div>
              <div className='h-8 bg-muted rounded-md w-full'></div>
              <div className='h-8 bg-muted rounded-md w-10/12'></div>
            </div>
            <div className='mt-6 h-12 bg-gradient-to-r from-primary to-accent rounded-md'>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
