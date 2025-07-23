export interface BaseTestConfig {
	timeout?: number;
	locale?: string;
	env?: Record<string, string>;
}

// biome-ignore lint/suspicious/noExplicitAny: Any assertion needed
export interface MockFunction<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): ReturnType<T>;
	calls: Array<Parameters<T>>;
	results: Array<ReturnType<T>>;
	callCount: number;
	reset(): void;
}
