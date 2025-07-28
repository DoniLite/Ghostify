import { createFactory } from 'hono/factory';
import type { Variables } from '../server';
import { DocumentService } from './lib/server/document/service/document.service';
import { UserService } from './lib/server/user/service/user.service';
import type { Context } from 'hono';

export const factory = createFactory<{
	Variables: Variables;
}>();

export type AppContext = Context<{ Variables: Variables }>;

// biome-ignore lint/complexity/noStaticOnlyClass: This instance will be shared across the application
export class ServiceFactory {
	private static instances = new Map();

	static getService<T, A>(
		serviceClass: new (...args: A[]) => T,
		...makers: A[]
	): T {
		if (!ServiceFactory.instances.has(serviceClass)) {
			ServiceFactory.instances.set(serviceClass, new serviceClass(...makers));
		}
		return ServiceFactory.instances.get(serviceClass);
	}

	static getUserService(): UserService {
		return ServiceFactory.getService(UserService);
	}

	static getDocumentService() {
		return ServiceFactory.getService(DocumentService);
	}
}
