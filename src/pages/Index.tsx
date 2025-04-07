import CallToAction from '../components/landing/CallToAction.tsx';
import Hero from '../components/landing/Hero.tsx';
import Services from '../components/landing/Services.tsx';

const Logos = ({logos}: {logos?: string[]}) => {
  if (logos) {
    return (
      <section class='py-10 border-t border-b border-gray-800'>
        <div class='container mx-auto px-4'>
          <p class='text-center text-gray-500 text-sm uppercase tracking-wider mb-8'>
            Ils nous font confiance
          </p>
          <div class='flex flex-wrap justify-center items-center gap-10 opacity-60'>
            {logos.map(l => (
              <div class='w-32 h-10 bg-gray-500 rounded opacity-50'>
                <img src={l} alt="partner logo" className=" h-[4rem] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
    </>
  )
};

export type IndexProps = {
  logos?: string[]
}

const Index = ({logos}: IndexProps) => (
  <div
    id='container'
    class='bg-gray-900 text-gray-100 min-h-screen custom-scrollbar'
  >
    <div class='fixed inset-0 overflow-hidden -z-10'>
      <div class='absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-gradient'></div>
      <div class='absolute top-1/4 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-gradient'></div>
      <div class='absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-gradient'></div>
    </div>
    <Hero />
    <Logos logos={logos} />
    <Services />
    <CallToAction />
  </div>
);

export default Index;
