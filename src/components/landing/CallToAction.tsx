import { Button } from '../utils/button.tsx';

const CtaSection = () => {
  return (
    <section className='py-20 px-6 lg:px-12 bg-background text-foreground'>
      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
        {/* Section 1: Launch your professional career */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
          <h2 className='text-4xl lg:text-5xl font-extrabold mb-6 font-nunito'>
            Lancez votre carrière professionnelle
          </h2>
          <p className='text-lg text-muted-foreground mb-8 font-inter'>
            Confectionnez vos dès maintenant un CV de qualité adapté à votre
            besoin et au marché grâce à notre générateur qui vous laisse la
            possibilité de personnaliser votre CV. Vous pouvez aussi bien
            choisir de les confectionner en masse ou utiliser notre API si vous
            souhaitez l'intégrer sur vos propres solutions.
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Button className='bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg hover:bg-accent transition-colors font-nunito'>
              Découvrir
            </Button>
            <Button className='border border-border text-foreground px-8 py-3 rounded-md text-lg hover:bg-muted transition-colors font-nunito'>
              En savoir plus
            </Button>
          </div>
        </div>

        {/* Section 2: Document Conversion Support */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
          <h2 className='text-4xl lg:text-5xl font-extrabold mb-6 font-nunito'>
            Nous supportons +30 types de documents en terme de conversion
          </h2>
          <p className='text-lg text-muted-foreground mb-8 font-inter'>
            Notre logiciel de conversion vous permet d'obtenir des résultats
            satisfaisants peu importe l'entrée ou la sortie que vous désirez.
            Grâce à des outils performants nous préservons le format de vos
            documents et leur qualité initiale. Vous pouvez aussi bien choisir
            de les convertir en masse ou utiliser notre API si vous souhaitez
            l'intégrer sur vos propres solutions.
          </p>
          <Button className='bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg hover:bg-accent transition-colors font-nunito'>
            Essayer gratuitement
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
