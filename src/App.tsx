import { Outlet, Route, Routes } from 'react-router-dom';
import NotFound from './components/shared/404';
import Wrapper from './components/shared/Layout';
import ScrollToTop from './components/shared/ScrollToTop';
import { TranslationProvider } from './components/shared/TranslationContext';
import Billing from './pages/Billing';
import Contact from './pages/Contact';
import Editor from './pages/Editor';
import Index from './pages/Index';
import Login from './pages/Login';
import { detectLocale } from './utils/translation';

const MainLayout = () => {
	const defaultLocale = detectLocale();
	return (
		<TranslationProvider initialLocale={defaultLocale}>
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
