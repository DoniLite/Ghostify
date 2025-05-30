import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index.tsx';
import Wrapper from './components/shared/Layout.tsx';
import Login from './pages/Login.tsx';
import { TranslationProvider } from './components/shared/TranslationContext.tsx';
import { detectLocale } from './utils/translation.ts';
import Billing from './pages/Billing.tsx';
import NotFound from './components/shared/404.tsx'

export default function App() {
  const defaultLocale = detectLocale();
  return (
    <TranslationProvider
      initialLocale={defaultLocale}
    >
      <Wrapper>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/login' element={<Login />} />
          <Route path='/billing' element={<Billing />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Wrapper>
    </TranslationProvider>
  );
}
