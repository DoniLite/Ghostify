const ProductivitySection = () => {
  return (
    <section className='py-20 px-6 lg:px-12 bg-background text-foreground text-center'>
      <div className='container mx-auto'>
        <div className='bg-card p-10 rounded-xl shadow-lg border border-border flex flex-col lg:flex-row items-center justify-between gap-8'>
          <h2 className='text-4xl lg:text-5xl font-extrabold text-primary font-nunito lg:w-1/2 text-center lg:text-left'>
            Tout ce qu'il faut pour booster votre productivité
          </h2>
          <p className='text-lg text-muted-foreground lg:w-1/2 text-center lg:text-right font-inter'>
            Ghostify est une plateforme tournée vers la productivité, vous
            permettant ainsi de vous inspirer non seulement de contenus d'autres
            utilisateurs mais aussi de bénéficier d'une assistance (IA) pour vos
            différentes taches tout en prenant compte de vos préférences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductivitySection;
