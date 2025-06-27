import type { User } from '@prisma/client';
import { create } from 'zustand';

interface AuthStore {
	auth: {
		authenticated: boolean;
		payload?: {
			login: User['email'] | User['username'];
			token: User['token'];
		};
	};
	setConnected(): void;
	disconnect(): Promise<void>;
	setPayload(loginPayload: AuthStore['auth']['payload']): void;
	clearPayload(): void;
	// checkLoginState(): Promise<boolean>;
	checkLoginState(): boolean;
}

export const useAuthStore = create<AuthStore>()((set) => ({
	auth: {
		authenticated: false,
	},
	setConnected: () =>
		set((state) => ({
			...state,
			auth: { ...state['auth'], authenticated: true },
		})),
	disconnect: async () => {},
	setPayload: (payload) =>
		set((state) => ({
			...state,
			auth: {
				...state['auth'],
				payload,
			},
		})),
	clearPayload: () =>
		set((state) => ({
			...state,
			auth: {
				...state['auth'],
				payload: undefined,
			},
		})),
	checkLoginState: () => {
		return true;
	},
}));
