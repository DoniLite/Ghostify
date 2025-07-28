/** biome-ignore-all lint/style/noNonNullAssertion: All assertions will be always available */
import {
	deleteCookie,
	// getCookie,
	getSignedCookie,
	// setCookie,
	setSignedCookie,
} from 'hono/cookie';
import { factory, type AppContext } from '../../factory';

const OPEN_ROUTES = ['/'];
const AUTH_ROUTES = [
	'/dashboard',
];

export const ROUTES = [...OPEN_ROUTES, ...AUTH_ROUTES];

const isAuthRoute = (url: string) =>
	AUTH_ROUTES.some((route) => url.includes(route));

export const authMiddleware = factory.createMiddleware(async (c, next) => {
	const redirectToSignIn = () => c.redirect('/login');
	const session = c.get('session');
	try {
		const verification = await checkUserSession(c);

		if (verification) {
			return redirectToSignIn();
		}

		await next();
	} catch (error) {
		console.error('Authentication middleware error:', error);
		session.set('RedirectUrl', c.req.url);
		return isAuthRoute(c.req.url) ? redirectToSignIn() : await next();
	}
});

const clearUserSession = async (c: AppContext) => {
	const session = c.get('session');
	session.set('Auth', { authenticated: false });
	session.set('RedirectUrl', c.req.url);
	deleteCookie(c, 'connection_time');
};
/**
 * Checks if the user session is authenticated and handles unauthenticated access.
 * If the user is not authenticated, sets a redirect URL and clears the connection cookie.
 *
 * Args:
 *   session (Session<SessionData>): The session object containing user authentication data.
 *   c (AppContext): The application context, including the current request.
 *
 * Returns:
 *   boolean: Returns true if the current route requires authentication and the user is not authenticated, otherwise false.
 */
export const checkUserSession = async (c: AppContext) => {
	const session = c.get('session');
	const connection_time = await getSignedCookie(
		c,
		Bun.env.SIGNED_COOKIE_SECRET!,
		'connection_time',
	);
	if (!session.get('Auth') || !!session.get('Auth')?.authenticated) {
		await clearUserSession(c);
		return isAuthRoute(c.req.url);
	}
	if (
		connection_time &&
		typeof connection_time === 'string' &&
		Date.now() > Number(connection_time)
	) {
		await refreshUserCookie(c);
		return false;
	}
	return false;
};

export const refreshUserCookie = async (c: AppContext) => {
	const cookieExpiration = new Date();
	cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
	await setSignedCookie(
		c,
		'connection_time',
		cookieExpiration.getTime().toString(),
		Bun.env.SIGNED_COOKIE_SECRET!,
	);
};
