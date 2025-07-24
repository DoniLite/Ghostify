/** biome-ignore-all lint/style/noNonNullAssertion: All assertions will be always available */
import { setSignedCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import { factory, ServiceFactory } from '../../factory';
import { LoginSchema } from '../../forms/auth/schema';
import { authMiddleware } from '../../hooks/server/auth';
import { logger } from '../../logger';
import { compareHash } from '../../utils/security/hash';

const authApp = factory.createApp();

const loginHandlers = factory.createHandlers(
	authMiddleware,
	validator('form', (value, c) => {
		const parsed = LoginSchema.safeParse(value);
		if (!parsed.success) {
			return c.text('Invalid!', 401);
		}
		return parsed.data;
	}),
	async (c) => {
		const session = c.get('session');
		const { login, password } = c.req.valid('form');
		const userService = ServiceFactory.getUserService();
		const redirectUrl = session.get('RedirectUrl');
		const user = await userService.login(login, password);

		if (!user) {
			logger.warn(
				'not authenticated login with: ' +
					login +
					' and' +
					password +
					' credentials',
				[login, password],
			);
			throw new HTTPException(404, {
				message: 'Not user found with this credentials',
			});
		}

		const verifiedPassword = await compareHash(password, user.password!);

		if (!verifiedPassword) {
			logger.warn(
				'not authenticated login with: ' +
					login +
					' and' +
					password +
					' credentials',
				[login, password],
			);
			throw new HTTPException(402, {
				message: 'wrong password provided',
			});
		}
		session.set('Auth', {
			authenticated: true,
			isSuperUser: false,
			login: login,
			id: user.id,
			avatar: user.avatar ?? undefined,
			username: user.username ?? undefined,
			fullname: user.fullname ?? undefined,
		});
		const cookieExpiration = new Date();
		cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
		session.set('Token', cookieExpiration.getTime().toString());

		await setSignedCookie(
			c,
			'connection_time',
			session.get('Token')!,
			Bun.env.SIGNED_COOKIE_SECRET!,
		);
		if (redirectUrl) {
			return c.redirect(redirectUrl);
		}
	},
);

authApp.post('/login', ...loginHandlers);
authApp.post('/register', async (c) => {
	const session = c.get('session');
	const userService = ServiceFactory.getUserService();
	const { email, fullname, password } = await c.req.json();
	const user = await userService.createUser(
		{
			email,
			fullname,
			password,
			permission: 'User',
		},
		c,
	);
	console.log('Created User ===> ', user);

	session.set('Auth', {
		authenticated: true,
		isSuperUser: false,
		login: user.email,
		id: user.id,
		avatar: user.avatar ?? undefined,
		username: user.username ?? undefined,
		fullname: user.fullname ?? undefined,
	});
	const cookieExpiration = new Date();
	cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
	session.set('Token', cookieExpiration.getTime().toString());

	await setSignedCookie(
		c,
		'connection_time',
		session.get('Token')!,
		Bun.env.SIGNED_COOKIE_SECRET!,
	);
	return c.json({ message: 'User created successfully' });
});

export default authApp;
