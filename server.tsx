import { Hono } from 'hono';
import { serveStatic } from 'hono/deno';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { CookieStore, Session, sessionMiddleware } from 'npm:hono-sessions';
import { type SessionData } from './src/@types/index.d.ts';
import sessionManager from './src/hooks/sessionStorage.ts';
import dotenv from 'dotenv';
import process from 'node:process';
import { languageDetector } from 'hono/language';
import { compress } from 'hono/compress';
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import path from 'node:path';
import { stream } from 'hono/streaming';
import authApp from './src/controller/auth.ts';
import { html } from 'hono/html';
import { termsMD } from './src/utils/templates/markdownPage.ts';
import { unify } from './src/utils/security/purify.ts';
import { verifyJWT } from './src/utils/security/jwt.ts';
import { getFileHeaders } from './src/utils/file_system/headers.ts';
import { renderToReadableStream } from 'react-dom/server';
import App from './src/App.tsx';
import { StaticRouter } from 'react-router-dom';
import { getThemeScript } from './src/components/shared/ThemeProvider.tsx';
import ApiRoutes from './src/api.ts';
import { cache } from 'hono/cache';

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


// Middlewares
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
  }),
);
// app.use('/api/*', (c, next) => {
//   const jwtMiddleware = jwt({
//     secret: Deno.env.get('JWT_SECRET')!,
//   });
//   return jwtMiddleware(c, next);
// });
app.use(compress());
app.use(
  '/*',
  languageDetector({
    supportedLanguages: ['en', 'fr', 'es'], // Must include fallback
    fallbackLanguage: 'en', // Required
    order: ['querystring', 'path', 'cookie', 'header'],
    lookupCookie: 'lang',
    lookupQueryString: 'lang',
  }),
);
app.use('/static/*', serveStatic({ root: './' }));
app.use('*', logger(), poweredBy({ serverName: 'Ghostify' }));
app.use('*', sessionManager);
app.use(
  '*',
  cache({
    cacheName: 'ghostify-cache',
    cacheControl: 'max-age=3600',
    wait: true
  }),
);

// Registered Routes
app.route('/auth/', authApp);
app.route('/api/v1', ApiRoutes)

// Routes
app.get('/init', (c) => {
  const session = c.get('session');
  const lang = c.get('language') as 'en' | 'es' | 'fr';
  const theme = session.get('Theme');
  const layout = {
    isHome: true,
    currentLocal: lang,
    theme: theme ?? {},
  };
  return c.json(layout);
});
app.get('/terms', async (c) => {
  const terms = await unify(termsMD);
  const htmlStr = html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        ${terms}
      </body>
    </html>
  `;
  return c.html(htmlStr);
});
app.get('/download/:file', async (c) => {
  const file = c.req.param('file');
  const resourceDir = path.resolve(process.cwd(), './static');
  try {
    const { path: rPath } = await verifyJWT(file);
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
    const { path: rPath } = await verifyJWT(file);
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
});
app.get('*', async (c) => {
  const stream = await renderToReadableStream(
    <StaticRouter location={c.req.path}>
      <App />
    </StaticRouter>,
    {
      bootstrapModules: ['/static/js/client.js'],
      bootstrapScriptContent: getThemeScript('dark')
    },
  );
  return c.newResponse(
    stream,
    200,
    { 'content-type': 'text/html' },
  );
});
Deno.serve({
  port: 8080,
}, app.fetch);
