import { ApiError } from '@/@types/api';
import type { User } from '@/db';
import { apiClient } from '@/hooks/client/useApi';
import type { CreateUserDTO } from '@/lib/server/user';
import { toast } from 'sonner';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AuthStore {
	auth: {
		authenticated: boolean;
		payload?: {
			login: User['email'] | User['username'];
			token: string;
		};
		authenticationError?: Error;
		isLoading?: boolean;
	};
	disconnect(): Promise<void>;
	login: (payload: AuthBodyInit) => Promise<{ redirectUrl?: string } | undefined>;
	register: (payload: CreateUserDTO) => Promise<User | null>;
	checkLoginState(): boolean;
	setLoading: (loading: boolean) => void;
}

interface AuthBodyInit {
	password: string;
	login: string;
}

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			(set, get) => ({
				auth: {
					authenticated: false,
					isLoading: false,
				},

				setLoading: (loading: boolean) => {
					set((state) => ({
						auth: { ...state.auth, isLoading: loading },
					}));
				},

				login: async (payload: AuthBodyInit) => {
					set((state) => ({
						auth: {
							...state.auth,
							isLoading: true,
							authenticationError: undefined,
						},
					}));

					try {
						const response = await apiClient.call('auth/login', 'make', {
							body: payload,
						});

						if (!response || response.status >= 400) {
							set((state) => ({
								auth: {
									...state.auth,
									isLoading: false,
								},
							}));
						}

						set((state) => ({
							auth: {
								...state.auth,
								isLoading: false,
								payload: response.data,
								authenticated: true,
							},
						}));
						if (
							response.data &&
							'redirectUrl' in response.data &&
							typeof response.data.redirectUrl === 'string'
						) {
							return { redirectUrl: response.data.redirectUrl };
						}
					} catch (e) {
						if (e instanceof ApiError) {
							set((state) => ({
								auth: {
									...state.auth,
									isLoading: false,
									authenticationError: e,
								},
							}));
						}
						toast.error(
							e instanceof Error ? e.message : 'Authentication failed',
						);
					}
				},

				register: async (payload: CreateUserDTO) => {
					set((state) => ({
						auth: { ...state.auth, isLoading: true },
					}));

					try {
						const response = await fetch('/api/auth/register', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(payload),
						});

						if (!response.ok) {
							throw new Error('Registration failed');
						}

						const data = await response.json();

						set((state) => ({
							auth: { ...state.auth, isLoading: false },
						}));

						toast.success('Registration successful!');
						return data;
					} catch (error) {
						set((state) => ({
							auth: {
								...state.auth,
								isLoading: false,
								authenticationError: error as Error,
							},
						}));

						toast.error('Registration failed');
						return null;
					}
				},

				disconnect: async () => {
					set(() => ({
						auth: {
							authenticated: false,
							payload: undefined,
							authenticationError: undefined,
							isLoading: false,
						},
					}));
					toast.success('Logged out successfully');
				},

				checkLoginState: () => {
					const { auth } = get();
					return auth.authenticated && !!auth.payload?.token;
				},
			}),
			{
				name: 'auth-store',
			},
		),
	),
);
