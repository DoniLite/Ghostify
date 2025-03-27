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
import $404 from './src/components/shared/404.tsx';
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import documentApp from './src/controller/document.tsx';
import path from 'node:path';
import { getFileHeaders, verifyJWT } from './src/utils.ts';
import { stream } from 'hono/streaming';

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
app.use('/auth/*', (c, next) => {
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
  })
);
app.use('/static/*', serveStatic({ root: './' }));
app.use('*', logger(), poweredBy({ serverName: 'Ghostify' }));
app.use('*', sessionManager);
app.get('/', (c) => {
  const session = c.get('session');
  const theme = session.get('Theme');
  const footer: FooterProps = {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    title: 'text-gray-400',
    theme: {
      footer: theme!.footer,
    },
  };
  const layout: LayoutType = {
    isHome: true,
    header: {
      auth: session.get('Auth')!.authenticated,
    },
    footer,
  };
  return c.html(
    <Wrapper {...layout}>
      <Index />
    </Wrapper>
  );
});
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
app.get('*', (c) => c.html(
  <$404 />
));

Deno.serve({
  port: 8080
},app.fetch);
