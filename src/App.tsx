import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index.tsx';
import Wrapper from './components/shared/Layout.tsx';
import Login from './pages/Login.tsx';
import { TranslationProvider } from './components/shared/TranslationContext.tsx';
import { detectLocale } from './utils/translation.ts';

export default function App() {
  const isServerSide = () => typeof window === 'undefined';
  const defaultLocale = detectLocale();
  return (
    <TranslationProvider
      initialLocale={defaultLocale}
      serverSide={isServerSide()}
    >
      <Wrapper>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Wrapper>
    </TranslationProvider>
  );
}
