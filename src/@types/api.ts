import type { User } from '@prisma/client';

export interface ApiResponse<T = unknown> {
	data: T;
	status: number;
	message?: string;
}

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public code?: string,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export interface ApiErrorInterface {
	message: string;
	status: number;
	code?: string;
}

export interface RouteDefinition {
	method: HttpMethod;
	response: unknown;
	params?: Record<string, unknown>;
	body?: unknown;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: unknown;
	params?: Record<string, unknown>;
}

export interface UseApiState<T> {
	data: T | null;
	loading: boolean;
	error: ApiError | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
	refetch: () => Promise<void>;
	mutate: (newData: T) => void;
}

export interface ApiRoutes {
	users: {
		list: {
			method: 'GET';
			response: User[];
			params?: { page?: number; limit?: number };
		};
		get: {
			method: 'GET';
			response: User;
			params: { id: number };
		};
		create: {
			method: 'POST';
			response: {
				id: User['id'];
				name: User['fullname'];
				email: User['email'];
			};
			body: { name: string; email: string };
		};
		update: {
			method: 'PUT';
			response: { id: number; name: string; email: string };
			params: { id: number };
			body: Partial<User>;
		};
		delete: {
			method: 'DELETE';
			response: { success: boolean };
			params: { id: number };
		};
	};
	documents: {
		list: {
			method: 'GET';
			response: {
				id: number;
				title: string;
				content: string;
				userId: number;
			}[];
			params?: { userId?: number; category?: string };
		};
		get: {
			method: 'GET';
			response: { id: number; title: string; content: string; userId: number };
			params: { id: number };
		};
		create: {
			method: 'POST';
			response: { id: number; title: string; content: string; userId: number };
			body: { title: string; content: string; userId: number };
		};
	};
}

// Utilitaires de types
export type ExtractResponse<T> = T extends { response: infer R } ? R : never;
export type ExtractParams<T> = T extends { params: infer P } ? P : never;
export type ExtractBody<T> = T extends { body: infer B } ? B : never;
export type ExtractMethod<T> = T extends { method: infer M } ? M : never;

export type RouteKey = keyof ApiRoutes;
export type EndpointKey<R extends RouteKey> = keyof ApiRoutes[R];

// Types contraints pour s'assurer que les endpoints suivent la structure RouteDefinition
export type RouteEndpoint<
	R extends RouteKey,
	E extends EndpointKey<R>,
> = ApiRoutes[R][E] extends RouteDefinition ? ApiRoutes[R][E] : never;
