import CallToAction from '../components/landing/CallToAction.tsx';
import Hero from '../components/landing/Hero.tsx';
import Services from '../components/landing/Services.tsx';
import ProductivitySection from '../components/landing/Productivity.tsx';
import OpenSourceSection from '../components/landing/OpenSource.tsx';
import { useSeo } from '../components/shared/SEO.ts';
import { useLocation } from 'react-router-dom';

const Index = () => {
  useSeo(useLocation().pathname, {
    title: 'Ghostify | Home',
  });
  return (
    <main>
      <div className='fixed inset-0 overflow-hidden -z-10'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-gradient'>
        </div>
        <div className='absolute top-1/4 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-gradient'>
        </div>
        <div className='absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-gradient'>
        </div>
      </div>
      <Hero />
      <Services />
      <CallToAction />
      <ProductivitySection />
      <OpenSourceSection />
    </main>
  );
};

export default Index;
