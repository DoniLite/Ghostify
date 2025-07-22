import { createFactory } from 'hono/factory';
import type { Variables } from '../server';
import  { UserService } from './lib/server/user/service/user.service';

export const factory = createFactory<{
	Variables: Variables;
}>();

// biome-ignore lint/complexity/noStaticOnlyClass: This instance will be shared across the application
export class ServiceFactory {
	private static instances = new Map();

	static getService<T>(serviceClass: new () => T): T {
		if (!ServiceFactory.instances.has(serviceClass)) {
			ServiceFactory.instances.set(serviceClass, new serviceClass());
		}
		return ServiceFactory.instances.get(serviceClass);
	}

	static getUserService(): UserService {
		return ServiceFactory.getService(UserService);
	}

}
