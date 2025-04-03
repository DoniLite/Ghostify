import { render, useEffect, useState } from 'hono/jsx/dom';

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
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  if (showButton) {
    return (
      <button
        type='button'
        onClick={scrollToTop}
        class='fixed bottom-6 right-6 bg-slate-900 text-white p-3 rounded-full shadow-lg transition-all hover:bg-slate-700 hover:cursor-pointer shadow-slate-500'
      >
        <IconArrowUp />
      </button>
    );
  }
  return null;
};

const IconArrowUp = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 384 512'
      class=' w-6 h-6 fill-white'
    >
      <path d='M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z' />
    </svg>
  );
};

let root = document?.getElementById('root');
if(!root) {
  const el = document.createElement('div');
  el.setAttribute('id', 'root');
  document.appendChild(el);
  root = document.getElementById('root')!;
}
render(<BackToTop />, root);
