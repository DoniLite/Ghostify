import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';
import Loader from '../shared/Loader';

export default function Layout() {
	const { authenticated, _hasHydrated } = useAuthStore((s) => s.auth);
	const navigate = useNavigate();

	useEffect(() => {
		if (_hasHydrated && !authenticated) {
			navigate('/login', {
				replace: true,
			});
		}
	}, [authenticated, navigate, _hasHydrated]);

	if (_hasHydrated && authenticated) {
		return (
			<SidebarProvider>
				<AppSidebar />
				<main className="container mx-auto p-4">
					<div className="w-full flex items-center justify-between mb-4">
						<SidebarTrigger className="cursor-pointer" />
					</div>
					<Outlet />
				</main>
			</SidebarProvider>
		);
	}
	return <Loader />;
}
