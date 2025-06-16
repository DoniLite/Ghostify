import { Outlet, Route, Routes } from 'react-router-dom';
import Index from './pages/Index.tsx';
import Wrapper from './components/shared/Layout.tsx';
import Login from './pages/Login.tsx';
import { TranslationProvider } from './components/shared/TranslationContext.tsx';
import { detectLocale } from './utils/translation.ts';
import Billing from './pages/Billing.tsx';
import NotFound from './components/shared/404.tsx';
import ScrollToTop from './components/shared/ScrollToTop.tsx';
import Contact from './pages/Contact.tsx';
import Editor from './pages/Editor.tsx';

const MainLayout = () => {
  const defaultLocale = detectLocale();
  return (
    <TranslationProvider
      initialLocale={defaultLocale}
    >
      <Wrapper>
        <Outlet />
      </Wrapper>
    </TranslationProvider>
  );
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path='login' element={<Login />} />
          <Route path='pricing' element={<Billing />} />
          <Route path='contact' element={<Contact />} />
          <Route path='editor/:userId/:documentId' element={<Editor />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
