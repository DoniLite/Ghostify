import { factory } from '../factory.ts';
import { authMiddleware } from '../hooks/auth.ts';
import { z } from 'zod';
import { validator } from 'hono/validator';
import Login from '../pages/Login.tsx';
import { prismaClient } from '../config/db.ts';
import { compareHash, getLoc } from '../utils.ts';
import { HTTPException } from 'hono/http-exception';
import { setSignedCookie } from 'hono/cookie';
import { logger } from '../logger.ts';
import Register from '../pages/Register.tsx';
import TLayout from '../components/shared/TLayout.tsx';
import dashboardApp from './dashboard.tsx';

const authApp = factory.createApp();

const LoginSchema = z.object({
  login: z.union([z.string(), z.string().email()]),
  password: z.string().trim(),
});

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
    const { login, password } = await c.req.valid('form');
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
        [login, password]
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
        [login, password]
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
      file: user.file!,
      username: user.username!,
      fullname: user.fullname!,
    });
    const cookieExpiration = new Date();
    cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
    session.set('Token', cookieExpiration.getTime().toString());

    await setSignedCookie(
      c,
      'connection_time',
      session.get('Token')!,
      Deno.env.get('SIGNED_COOKIE_SECRET')!
    );
    if (redirectUrl) {
      return c.redirect(redirectUrl);
    }
  }
);

authApp.post('/login', ...loginHandlers);
authApp.get('/login', authMiddleware, async (c) => {
  const lang = c.get('language') as "fr" | "es" | "en";
  const loc = await getLoc(lang);
  const props = {
    title: 'Ghostify | Login',
    description: 'Login to your account',
  }
  return c.html(
    <TLayout meta={props} locales={loc} currentLocal={lang}>
      <Login />
    </TLayout>
  );
});
authApp.get('/register', async (c) => {
  const lang = c.get('language') as 'fr' | 'es' | 'en';
  const loc = await getLoc(lang);
   const props = {
    title: 'Ghostify | Login',
    description: 'Login to your account',
  }
  return c.html(
    <TLayout meta={props} locales={loc} currentLocal={lang}>
      <Register />
    </TLayout>
  );
})
authApp.route('/dashboard', dashboardApp)

export default authApp;
