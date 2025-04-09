import { render, useEffect, useState } from 'hono/jsx/dom';
import { ArrowUp } from '../components/shared/Icons.tsx';

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);
  const scrollToTop = () => {
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    setShowButton(globalThis.scrollY > 300); // Affiche le bouton après 300px de scroll
  };

  useEffect(() => {
    globalThis.addEventListener('scroll', handleScroll);
  }, []);

  if (showButton) {
    return (
      <button
        type='button'
        onClick={scrollToTop}
        class='fixed bottom-6 right-6 bg-slate-950 text-white p-3 rounded-full shadow-lg transition-all hover:bg-slate-800 hover:cursor-pointer shadow-slate-700'
      >
        <ArrowUp color='w-6 h-6 fill-orange-500' />
      </button>
    );
  }
  return null;
};


const root = document?.getElementById('backToTop')!;
render(<BackToTop />, root);
