import { Hono } from 'hono'
import { CookieStore, Session, sessionMiddleware } from 'hono-sessions'
import { compress } from 'hono/compress'
import { serveStatic } from 'hono/deno'
import { languageDetector } from 'hono/language'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'
import { secureHeaders } from 'hono/secure-headers'
import process from 'node:process'
import type { SessionData } from './src/@types/index.d'
import sessionManager from './src/hooks/sessionStorage'
// import { jwt } from 'hono/jwt';
import { cache } from 'hono/cache'
import { html } from 'hono/html'
import type { JwtVariables } from 'hono/jwt'
import { stream } from 'hono/streaming'
import { open, readFile } from 'node:fs/promises'
import path from 'node:path'
import { renderToReadableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import ApiRoutes from './src/api'
import App from './src/App'
import { getThemeScript } from './src/components/shared/ThemeProvider'
import { getFileHeaders } from './src/utils/file_system/headers'
import { verifyJWT } from './src/utils/security/jwt'
import { unify } from './src/utils/security/purify'
import { termsMD } from './src/utils/templates/markdownPage'

export type Variables = {
  session: Session<SessionData>
  session_key_rotation: boolean
} & JwtVariables

const app = new Hono<{
  Variables: Variables
}>()

const store = new CookieStore()

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
      httpOnly: true // Recommended to avoid XSS attacks
    }
  })
)
// app.use('/api/*', (c, next) => {
//   const jwtMiddleware = jwt({
//     secret: Deno.env.get('JWT_SECRET')!,
//   });
//   return jwtMiddleware(c, next);
// });
app.use(compress())
app.use(
  '/*',
  languageDetector({
    supportedLanguages: ['en', 'fr', 'es'], // Must include fallback
    fallbackLanguage: 'en', // Required
    order: ['querystring', 'path', 'cookie', 'header'],
    lookupCookie: 'lang',
    lookupQueryString: 'lang'
  })
)
app.use('/static/*', serveStatic({ root: './' }))
app.use('*', logger(), poweredBy({ serverName: 'Ghostify' }))
app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", 'wss:', 'https:'],
      fontSrc: ["'self'", 'data:', 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
      frameAncestors: ["'none'"], // don't integrate the site via iframe
      formAction: ["'self'"],
      baseUri: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
      sandbox: [
        'allow-forms',
        'allow-scripts',
        'allow-same-origin',
        'allow-popups',
        'allow-modals',
        'allow-downloads'
      ]
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: 'same-origin',
    xXssProtection: true
  })
)
app.use('*', sessionManager)
app.use(
  '*',
  cache({
    cacheName: 'ghostify-cache',
    cacheControl: 'max-age=3600',
    wait: true
  })
)

// Registered Routes
app.route('/api/v1', ApiRoutes)

// Routes
app.get('/terms', async (c) => {
  const terms = await unify(termsMD)
  const htmlStr = html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Document</title>
      </head>
      <body>
        ${terms}
      </body>
    </html>
  `
  return c.html(htmlStr)
})
app.get('/download/:file', async (c) => {
  const file = c.req.param('file')
  const resourceDir = path.resolve(process.cwd(), './static')
  try {
    const { path: rPath } = await verifyJWT(file)
    if (typeof rPath === 'string') {
      const resourcePath = path.join(resourceDir, rPath)
      const fileContent = await readFile(resourcePath)
      const headers = getFileHeaders(resourcePath, true)
      c.status(200)
      return c.newResponse(fileContent, 200, headers)
    }
    c.status(404)
    return c.text('Invalid credentials')
  } catch (err) {
    console.error(err)
    c.status(404)
    return c.text('cannot access to this resource')
  }
})
app.get('/download/:file/cloud', async () => {})
app.get('/stream/:file', async (c) => {
  const file = c.req.param('file')
  const resourceDir = path.resolve(process.cwd(), './static')
  try {
    const { path: rPath } = await verifyJWT(file)
    if (typeof rPath === 'string') {
      const resourcePath = path.join(resourceDir, rPath)
      c.status(200)
      return stream(c, async (s) => {
        const sFile = await open(resourcePath)
        const content = await sFile.read()
        await sFile.close()
        await s.write(content.buffer)
      })
    }
    c.status(404)
    return c.text('Invalid credentials')
  } catch (err) {
    console.error(err)
    c.status(404)
    return c.text('cannot access to this resource')
  }
})
app.get('/stream/:file/cloud', async () => {})
app.get('*', async (c) => {
  const s = await renderToReadableStream(
    <StaticRouter location={c.req.path}>
      <App />
    </StaticRouter>,
    {
      bootstrapModules: ['/static/js/client.js'],
      bootstrapScriptContent: getThemeScript('dark')
    }
  )
  return c.newResponse(s, 200, { 'content-type': 'text/html' })
})
Bun.serve({
  port: 8080,
  fetch: app.fetch
})
