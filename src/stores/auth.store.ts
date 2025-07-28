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
			token: string | null;
		};
		authenticationError?: Error;
		isLoading?: boolean;
		_hasHydrated: boolean;
	};
	disconnect(): Promise<void>;
	login: (
		payload: AuthBodyInit,
	) => Promise<{ redirectUrl?: string } | undefined>;
	register: (payload: {
		email: CreateUserDTO['email'];
		password: CreateUserDTO['password'];
	}) => Promise<{ redirectUrl?: string } | undefined>;
	checkLoginState(): boolean;
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
					authenticationError: undefined,
					_hasHydrated: false,
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
								payload: {
									login: response.data?.login ?? null,
									token: response.data?.token ?? null,
								},
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

				register: async (payload) => {
					set((state) => ({
						auth: {
							...state.auth,
							isLoading: true,
							authenticationError: undefined,
						},
					}));

					try {
						const response = await apiClient.call('auth/register', 'make', {
							body: {
								...payload,
								permission: 'User',
							},
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
								payload: {
									login: response.data?.login ?? null,
									token: response.data?.token ?? null,
								},
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

				disconnect: async () => {
					toast.success('Logged out successfully');
				},

				checkLoginState: () => {
					const { auth } = get();
					return auth.authenticated && !!auth.payload?.token;
				},
			}),
			{
				name: 'auth-store',
				onRehydrateStorage: () => (state) => {
					if (state) {
						state.auth._hasHydrated = true;
					}
				},
			},
		),
	),
);
