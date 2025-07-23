import { Outlet, Route, Routes } from 'react-router-dom';
import NotFound from './components/shared/404';
import Wrapper, { LocalsContext } from './components/shared/Layout';
import ScrollToTop from './components/shared/ScrollToTop';
import { defaultSeo, SeoContext } from './components/shared/SEO';
import { ThemeProvider } from './components/shared/ThemeProvider';
import { TranslationProvider } from './components/shared/TranslationContext';
import Billing from './pages/Billing';
import Contact from './pages/Contact';
import Editor from './pages/Editor';
import Index from './pages/Index';
import Login from './pages/Login';
import { detectLocale } from './utils/translation';
import './assets/tailwind.css';

const MainLayout = ({ request }: { request?: Request }) => {
	const defaultLocale = detectLocale(request);
	return (
		<LocalsContext.Provider value={{ default: {} }}>
			<SeoContext.Provider value={defaultSeo}>
				<ThemeProvider>
					<TranslationProvider initialLocale={defaultLocale}>
						<Wrapper>
							<Outlet />
						</Wrapper>
					</TranslationProvider>
				</ThemeProvider>
			</SeoContext.Provider>
		</LocalsContext.Provider>
	);
};

export default function App({ request }: { request?: Request }) {
	return (
		<>
			<ScrollToTop />
			<Routes>
				<Route element={<MainLayout request={request} />}>
					<Route index element={<Index />} />
					<Route path="login" element={<Login />} />
					<Route path="pricing" element={<Billing />} />
					<Route path="contact" element={<Contact />} />
					<Route path="editor/:userId/:documentId" element={<Editor />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</>
	);
}
