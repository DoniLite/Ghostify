import { factory } from '../../factory';

const sessionMiddleware = factory.createMiddleware(async (c, next) => {
	const session = c.get('session');
	if (!session.get('Auth')) {
		session.set('Auth', {
			authenticated: false,
		});
	}
	if (!session.get('Services')) {
		session.set('Services', {
			Platform: {
				internals: true,
				API: true,
			},
		});
	}
	session.set('RedirectUrl', '/home');
	await next();
});

export default sessionMiddleware;
