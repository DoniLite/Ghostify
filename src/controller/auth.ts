import { setSignedCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import { prismaClient } from '../config/db';
import { factory } from '../factory';
import { LoginSchema, RegisterSchema } from '../forms/auth/schema';
import { authMiddleware } from '../hooks/auth';
import { logger } from '../logger';
import { compareHash } from '../utils/security/hash';
import dashboardApp from './dashboard';

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
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const redirectUrl = session.get('RedirectUrl');
		const user = emailRegex.test(login)
			? await prismaClient.user.findUnique({
					where: {
						email: login,
					},
				})
			: await prismaClient.user.findUnique({
					where: {
						username: login,
					},
				});

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

const registerHandlers = factory.createHandlers(
	validator('form', (value, c) => {
		const parsed = RegisterSchema.safeParse(value);
		if (!parsed.success) {
			return c.text('Invalid!', 401);
		}
		return parsed.data;
	}),
);

authApp.post('/login', ...loginHandlers);
authApp.post('/register', ...registerHandlers, async (c) => {
	const session = c.get('session');
	const { email, fullname, password } = c.req.valid('form');
	const user = await prismaClient.user.create({
		data: {
			email,
			fullname,
			password,
			permission: 'User',
		},
	});

	session.set('Auth', {
		authenticated: true,
		isSuperUser: false,
		login: email,
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
// authApp.get('/login', authMiddleware, async (c) => {
//   const lang = c.get('language') as "fr" | "es" | "en";
//   const loc = await getLoc(lang);
//   const props = {
//     title: 'Ghostify | Login',
//     description: 'Login to your account',
//   }
//   return c.html(
//     <TLayout meta={props} locales={loc} currentLocal={lang}>
//       <Login />
//     </TLayout>
//   );
// });
// authApp.get('/register', async (c) => {
//   const lang = c.get('language') as 'fr' | 'es' | 'en';
//   const loc = await getLoc(lang);
//    const props = {
//     title: 'Ghostify | Login',
//     description: 'Login to your account',
//   }
//   return c.html(
//     <TLayout meta={props} locales={loc} currentLocal={lang}>
//       <Register />
//     </TLayout>
//   );
// })
authApp.route('/dashboard', dashboardApp);

export default authApp;
