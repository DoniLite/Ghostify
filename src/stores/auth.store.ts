import { toast } from 'sonner';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ApiError } from '@/@types/api';
import type { User } from '@/db';
import { apiClient } from '@/hooks/client/useApi';
import type { CreateUserDTO } from '@/lib/server/user';

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
	checkLoginState(): Promise<{ redirectUrl: string } | undefined>;
}

interface AuthBodyInit {
	password: string;
	login: string;
}

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			(set) => ({
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

				checkLoginState: async () => {
					try {
						const response = await apiClient.call('auth/me', 'make');
						if (
							response.status === 200 &&
							response.data &&
							'token' in response.data &&
							typeof response.data.token === 'string'
						) {
							set((state) => ({
								auth: {
									...state.auth,
									payload: {
										login: state.auth.payload?.login ?? null,
										token: (response.data as { token: string }).token as string,
									},
								},
							}));
						}

						return response.data as { redirectUrl: string };
					} catch (e) {
						if (e instanceof ApiError) {
							set((state) => ({
								auth: {
									...state.auth,
									authenticationError: e,
								},
							}));
						}
						return {
							redirectUrl: '/login',
						};
					}
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
