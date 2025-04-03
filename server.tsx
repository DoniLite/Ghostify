import { Hono} from 'hono';
import { serveStatic } from 'hono/deno';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { Session, sessionMiddleware, CookieStore } from 'npm:hono-sessions';
import { type SessionData } from './src/@types/index.d.ts';
import Wrapper, { type LayoutType } from './src/components/shared/Layout.tsx';
import Index from './src/pages/Index.tsx';
import { type Props as FooterProps } from './src/components/shared/Footer.tsx';
import sessionManager from './src/hooks/sessionStorage.ts';
import dotenv from 'dotenv';
import process from 'node:process';
import { languageDetector } from 'hono/language';
import { compress } from 'hono/compress';
import NotFound from './src/components/shared/404.tsx';
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import documentApp from './src/controller/document.tsx';
import path from 'node:path';
import { getFileHeaders, getLoc, termsMD, unify, verifyJWT } from './src/utils.ts';
import { stream } from 'hono/streaming';
import authApp from './src/controller/auth.tsx';
import { html } from 'hono/html';

if (Deno.env.get('NODE_ENV') !== 'production') {
  dotenv.config();
}

export type Variables = {
  session: Session<SessionData>;
  session_key_rotation: boolean;
} & JwtVariables;

const app = new Hono<{
  Variables: Variables;
}>();

const store = new CookieStore();

app.use(
  '*',
  sessionMiddleware({
    store,
    encryptionKey: Deno.env.get('SESSION_SECRET'), // Required for CookieStore, recommended for others
    expireAfterSeconds: 1800, // Expire session after 15 minutes of inactivity
    cookieOptions: {
      sameSite: 'Lax', // Recommended for basic CSRF protection in modern browsers
      path: '/', // Required for this library to work properly
      httpOnly: true, // Recommended to avoid XSS attacks
    },
  })
);
app.use('/api/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: Deno.env.get('JWT_SECRET')!,
  });
  return jwtMiddleware(c, next);
});
app.use(compress());
app.use(
  '/*',
  languageDetector({
    supportedLanguages: ['en', 'fr', 'es'], // Must include fallback
    fallbackLanguage: 'en', // Required
    order: ['querystring', 'path', 'cookie', 'header'],
    lookupCookie: 'lang',
    lookupQueryString: 'lang'
  })
);
app.use('/static/*', serveStatic({ root: './' }));
app.use('*', logger(), poweredBy({ serverName: 'Ghostify' }));
app.use('*', sessionManager);
app.get('/', async (c) => {
  const session = c.get('session');
  const lang = c.get('language') as 'en' | 'es' | 'fr';
  const loc = await getLoc(lang);
  const theme = session.get('Theme');
  const footer: FooterProps = {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    title: 'text-gray-400',
  };
  const layout: LayoutType = {
    isHome: true,
    header: {
      auth: session.get('Auth')!.authenticated,
    },
    footer,
    currentLocal: lang,
    locales: loc,
    theme: theme ?? {},
  };
  return c.html(
    <Wrapper {...layout}>
      <Index />
    </Wrapper>
  );
});
app.get('/terms', async (c) => {
  const terms = await unify(termsMD)
  const htmlStr = html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        ${terms}
      </body>
    </html>`;
  return c.html(htmlStr);
})
app.get('/download/:file', async (c) => {
  const file = c.req.param('file');
  const resourceDir = path.resolve(process.cwd(), './static');
  try {
    const {path: rPath} = await verifyJWT(file);
    if (typeof rPath === 'string') {
      const resourcePath = path.join(resourceDir, rPath);
      const fileContent = await Deno.readFile(resourcePath);
      const headers = getFileHeaders(resourcePath, true);
      c.status(200);
      return c.newResponse(
        fileContent,
        200,
        headers,
      );
    }
    c.status(404);
    return c.text('Invalid credentials');
  } catch (err) {
    console.error(err);
    c.status(404);
    return c.text('cannot access to this resource');
  }
});
app.get('/stream/:file', async (c) => {
  const file = c.req.param('file');
  const resourceDir = path.resolve(process.cwd(), './static');
  try {
    const {path: rPath} = await verifyJWT(file);
    if (typeof rPath === 'string') {
      const resourcePath = path.join(resourceDir, rPath);
      const fileContent = await Deno.open(resourcePath);
      c.status(200);
      return stream(c, async (stream) => {
        await stream.pipe(fileContent.readable);
      });
    }
    c.status(404);
    return c.text('Invalid credentials');
  } catch (err) {
    console.error(err);
    c.status(404);
    return c.text('cannot access to this resource');
  }
})
app.route('/document/', documentApp);
app.route('/auth/', authApp);
app.get('*', (c) => c.html(
  <NotFound />
));

Deno.serve({
  port: 8080
},app.fetch);
