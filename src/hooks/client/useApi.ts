import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureUrlEnd } from '@/utils/shared.helpers';
import {
	ApiError,
	type ApiResponse,
	type EndpointKey,
	type ExtractBody,
	type ExtractParams,
	type ExtractResponse,
	type HttpMethod,
	type RequestConfig,
	type RouteEndpoint,
	type RouteKey,
	type UseApiReturn,
} from '../../@types/api';

class ApiClient {
	private baseURL: string;
	private defaultHeaders: Record<string, string>;

	constructor(
		baseURL: string = process.env.APP_HOST ?? 'http://localhost:8080/',
	) {
		this.baseURL = ensureUrlEnd(baseURL);
		this.defaultHeaders = {
			'Content-Type': 'application/json',
		};
	}

	setBaseURL(url: string) {
		this.baseURL = url;
	}

	setDefaultHeaders(headers: Record<string, string>) {
		this.defaultHeaders = { ...this.defaultHeaders, ...headers };
	}

	setAuthToken(token: string) {
		this.defaultHeaders.Authorization = `Bearer ${token}`;
	}

	private buildURL(path: string, params?: Record<string, unknown>): string {
		let url = `${this.baseURL}${path}`;

		if (params) {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					searchParams.append(key, String(value));
				}
			});

			const queryString = searchParams.toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		return url;
	}

	async request<T>(
		path: string,
		config: RequestConfig = {},
	): Promise<ApiResponse<T>> {
		const { method = 'GET', headers = {}, body, params } = config;

		const url = this.buildURL(path, method === 'GET' ? params : undefined);

		const requestHeaders = {
			...this.defaultHeaders,
			...headers,
		};

		const requestConfig: RequestInit = {
			method,
			headers: requestHeaders,
		};

		if (body && method !== 'GET') {
			requestConfig.body =
				typeof body === 'string' ? body : JSON.stringify(body);
		}

		try {
			const response = await fetch(url, requestConfig);

			if (!response.ok) {
				const errorData: { message?: string; code?: string } = await response
					.json()
					.catch(() => ({}));
				throw new ApiError(
					errorData.message || `HTTP Error: ${response.status}`,
					response.status,
					errorData.code,
				);
			}

			const data: T = await response.json();

			return {
				data,
				status: response.status,
				message:
					typeof data === 'object' && data !== null && 'message' in data
						? (data as { message?: string }).message
						: undefined,
			};
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			if (error instanceof Error) {
				throw new ApiError(error.message, 0);
			}
			throw new ApiError('Unknown error occurred', 0);
		}
	}

	// Typed method for the routes
	call<R extends RouteKey, E extends EndpointKey<R>>(
		route: R,
		endpoint: E,
		options?: {
			params?: ExtractParams<RouteEndpoint<R, E>>;
			body?: ExtractBody<RouteEndpoint<R, E>>;
		},
	): Promise<ApiResponse<ExtractResponse<RouteEndpoint<R, E>>>> {
		const ApiRoutes: Record<string, Record<string, { method: HttpMethod }>> = {
			users: {
				list: { method: 'GET' },
				get: { method: 'GET' },
				create: { method: 'POST' },
				update: { method: 'PUT' },
				delete: { method: 'DELETE' },
			},
			posts: {
				list: { method: 'GET' },
				get: { method: 'GET' },
				create: { method: 'POST' },
			},
		};
		const routeConfig = ApiRoutes[route as string]?.[endpoint as string];

		if (!routeConfig) {
			throw new ApiError(
				`Route ${String(route)}.${String(endpoint)} not found`,
				404,
			);
		}

		// Building the path depending on the endpoint
		let path = `/${String(route)}`;

		// If not a list or have an ID in the param
		if (
			endpoint !== 'list' &&
			options?.params &&
			typeof options.params === 'object' &&
			'id' in options.params
		) {
			path += `/${(options.params as { id: string | number }).id}`;
		}

		return this.request<ExtractResponse<RouteEndpoint<R, E>>>(path, {
			method: routeConfig.method,
			params:
				routeConfig.method === 'GET'
					? (options?.params as Record<string, unknown>)
					: undefined,
			body: options?.body,
		});
	}
}

// Global Instance
export const apiClient = new ApiClient();

export function useApi<R extends RouteKey, E extends EndpointKey<R>>(
	route: R,
	endpoint: E,
	options?: {
		params?: ExtractParams<RouteEndpoint<R, E>>;
		body?: ExtractBody<RouteEndpoint<R, E>>;
		immediate?: boolean;
		dependencies?: unknown[];
	},
): UseApiReturn<ExtractResponse<RouteEndpoint<R, E>>> {
	const [data, setData] = useState<ExtractResponse<RouteEndpoint<R, E>> | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	const optionsRef = useRef(options);
	optionsRef.current = options;

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await apiClient.call(route, endpoint, {
				params: optionsRef.current?.params,
				body: optionsRef.current?.body,
			});
			setData(response.data);
		} catch (err) {
			setError(err as ApiError);
		} finally {
			setLoading(false);
		}
	}, [route, endpoint]);

	const mutate = useCallback(
		(newData: ExtractResponse<RouteEndpoint<R, E>>) => {
			setData(newData);
		},
		[],
	);

	useEffect(() => {
		if (options?.immediate !== false) {
			fetchData();
		}
	}, [fetchData, options?.immediate]);

	return {
		data,
		loading,
		error,
		refetch: fetchData,
		mutate,
	};
}

// Hook pour les mutations
export function useApiMutation<R extends RouteKey, E extends EndpointKey<R>>(
	route: R,
	endpoint: E,
) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	const mutate = useCallback(
		async (options?: {
			params?: ExtractParams<RouteEndpoint<R, E>>;
			body?: ExtractBody<RouteEndpoint<R, E>>;
		}) => {
			setLoading(true);
			setError(null);

			try {
				const response = await apiClient.call(route, endpoint, options);
				return response.data;
			} catch (err) {
				setError(err as ApiError);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[route, endpoint],
	);

	return {
		mutate,
		loading,
		error,
	};
}
