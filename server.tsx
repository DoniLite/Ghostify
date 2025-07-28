import 'reflect-metadata';
import 'dotenv/config';
import { open, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import type { ServerWebSocket } from 'bun';
import { Hono } from 'hono';
import { createBunWebSocket, serveStatic } from 'hono/bun';
// import { jwt } from 'hono/jwt';
import { cache } from 'hono/cache';
// import { compress } from 'hono/compress';
import { html } from 'hono/html';
import { HTTPException } from 'hono/http-exception';
import type { JwtVariables } from 'hono/jwt';
import { languageDetector } from 'hono/language';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
// import { secureHeaders } from 'hono/secure-headers';
import { stream } from 'hono/streaming';
import { CookieStore, type Session, sessionMiddleware } from 'hono-sessions';
import { renderToReadableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ValidationError } from '@/core/decorators';
import authApp from '@/routes/auth/auth';
import type { SessionData } from './src/@types/index.d';
import App from './src/App';
import ApiRoutes from './src/api';
// import { getThemeScript } from './src/components/shared/ThemeProvider';
import sessionManager from './src/hooks/server/sessionStorage';
import { getFileHeaders } from './src/utils/file_system/headers';
import { verifyJWT } from './src/utils/security/jwt';
import { unify } from './src/utils/security/purify';
import { termsMD } from './src/utils/templates/markdownPage';

const SERVER_PORT = process.env.PORT || 8080;

export type Variables = {
	session: Session<SessionData>;
	session_key_rotation: boolean;
} & JwtVariables;

const app = new Hono<{
	Variables: Variables;
}>();

app.onError((e, c) => {
	if (e instanceof ValidationError) {
		return c.json({ errors: e.errors, message: e.message }, e.statusCode);
	}
	if (e instanceof HTTPException) {
		return e.getResponse();
	}
	console.error(e);
	return c.json({ error: 'Internal server error' }, 500);
});

const store = new CookieStore();

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

app.get(
	'/ws/document/:docId',
	upgradeWebSocket((c) => {
		// Example: pass ?id=123 to join a specific doc room
		const docId = c.req.param('docId');

		return {
			onOpen(_evt, ws) {
				// Bun’s native pub/sub helpers
				ws.raw?.subscribe(`doc:${docId}`);
				ws.send(JSON.stringify({ message: `Joined doc room ${docId}` }));
			},
			onMessage(evt, ws) {
				// Broadcast edit to everyone in the room
				ws.raw?.publish(`doc:${docId}`, evt.data.toString());
			},
			onClose() {
				console.log(`Socket closed for doc ${docId}`);
			},
		};
	}),
);

// Middlewares
app.use(
	'*',
	sessionMiddleware({
		store,
		encryptionKey: Bun.env.SESSION_SECRET, // Required for CookieStore, recommended for others
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
// app.use(compress());
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
// app.use(
// 	'*',
// 	secureHeaders({
// 		contentSecurityPolicy: {
// 			defaultSrc: ["'self'"],
// 			scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
// 			styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
// 			fontSrc: ["'self'", 'data:', 'fonts.gstatic.com'],
// 			imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
// 			connectSrc: ["'self'", 'wss:', 'https:'],
// 			objectSrc: ["'none'"],
// 			mediaSrc: ["'self'"],
// 			frameSrc: ["'self'"],
// 			frameAncestors: ["'none'"],
// 			formAction: ["'self'"],
// 			baseUri: ["'self'"],
// 			manifestSrc: ["'self'"],
// 			workerSrc: ["'self'", 'blob:'],
// 			sandbox: [
// 				'allow-forms',
// 				'allow-scripts',
// 				'allow-popups',
// 				'allow-modals',
// 				'allow-downloads',
// 			],
// 		},
// 		crossOriginEmbedderPolicy: true,
// 		crossOriginOpenerPolicy: true,
// 		crossOriginResourcePolicy: 'same-origin',
// 		xXssProtection: true,
// 		// crossOriginEmbedderPolicy: false,
// 		// crossOriginOpenerPolicy: false,
// 		// crossOriginResourcePolicy: false,
// 	}),
// );
app.use('*', sessionManager);
app.use(
	'*',
	cache({
		cacheName: 'ghostify-cache',
		cacheControl: 'max-age=3600',
	}),
);

// Registered Routes
app.route('/api/v1', ApiRoutes);
app.route('/auth', authApp);

// Routes
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
			const fileContent = await readFile(resourcePath);
			const headers = getFileHeaders(resourcePath, true);
			c.status(200);
			return c.newResponse(fileContent, 200, headers);
		}
		c.status(404);
		return c.text('Invalid credentials');
	} catch (err) {
		console.error(err);
		c.status(404);
		return c.text('cannot access to this resource');
	}
});
app.get('/download/:file/cloud', async (c) => {
	return c.text('Not implemented yet', 501);
});
app.get('/stream/:file', async (c) => {
	const file = c.req.param('file');
	const resourceDir = path.resolve(process.cwd(), './static');
	try {
		const { path: rPath } = await verifyJWT(file);
		if (typeof rPath === 'string') {
			const resourcePath = path.join(resourceDir, rPath);
			c.status(200);
			return stream(c, async (s) => {
				const sFile = await open(resourcePath);
				const content = await sFile.read();
				await sFile.close();
				await s.write(content.buffer);
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
app.get('/stream/:file/cloud', async (c) => {
	return c.text('Not implemented yet', 501);
});
app.get('*', async (c) => {
	const s = await renderToReadableStream(
		<StaticRouter location={c.req.path}>
			<App request={c.req.raw} />
		</StaticRouter>,
		{
			bootstrapModules: ['/static/js/client.js'],
			// bootstrapScriptContent: getThemeScript(),
		},
	);
	return c.newResponse(s, 200, { 'content-type': 'text/html' });
});
Bun.serve({
	port: SERVER_PORT,
	fetch: app.fetch,
	websocket,
});
console.log('Server is running on the port: ', SERVER_PORT);
