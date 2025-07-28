import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import { generateToken } from '@/utils/security/jwt';
import { factory, ServiceFactory } from '../../factory';
import { LoginSchema } from '../../forms/auth/schema';
import { authMiddleware } from '../../hooks/server/auth';

const authApp = factory.createApp();

const loginHandlers = factory.createHandlers(
	authMiddleware,
	validator('json', (value) => {
		const parsed = LoginSchema.safeParse(value);
		console.log('validation begin');
		if (!parsed.success) {
			console.log('validation failed');
			const err = parsed.error;
			throw new HTTPException(400, {
				message: 'Validation failed',
				res: new Response(
					JSON.stringify({
						message: 'Invalid form field provided',
						errors: err.errors.map((e) => ({
							property: e.path.join('.'),
							constraints: e.message,
							value: value[e.path.join('.')],
						})),
					}),
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			});
		}
		return parsed.data;
	}),
	async (c) => {
		const session = c.get('session');
		const { login, password } = c.req.valid('json');
		const userService = ServiceFactory.getUserService();
		const redirectUrl = session.get('RedirectUrl');
		const user = await userService.login({ login, password }, c);
		if (redirectUrl) {
			return c.json({ ...user, redirectUrl });
		}
		return c.json({
			...user,
			redirectUrl: '/dashboard',
		});
	},
);

authApp.post('/login', ...loginHandlers);
authApp.post('/register', async (c) => {
	const session = c.get('session');
	const redirectUrl = session.get('RedirectUrl');
	const userService = ServiceFactory.getUserService();
	const { email, password } = await c.req.json();
	const user = await userService.createUser(
		{
			email,
			password,
			permission: 'User',
		},
		c,
	);
	if (redirectUrl) {
		return c.json({ ...user, redirectUrl });
	}
	return c.json({
		...user,
		redirectUrl: '/dashboard',
	});
});

authApp.get('/me', async (c) => {
	const userService = ServiceFactory.getUserService();
	const verified = await userService.checkUserSession(c);
	const session = c.get('session');
	const token = session.get('Token');
	if (verified && token) {
		const decodedUserToken = await userService.decodeUserToken(token);
		const refreshToken = await generateToken({
			email: decodedUserToken.email,
			permission: decodedUserToken.permission,
		});
		return c.json({
			token: refreshToken,
		});
	}
	return c.json({
		redirectUrl: '/login',
	});
});

export default authApp;
