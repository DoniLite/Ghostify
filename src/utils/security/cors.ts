import { cors } from 'hono/cors'

/**
 * Middleware CORS for images
 * Allowed origins are sourced from the CORS_ORIGINS environment variable (comma-separated).
 */
export const allowedOrigins = Bun.env.CORS_ORIGINS
  ? Bun.env.CORS_ORIGINS!.split(',').map((origin) => origin.trim())
  : []

export const serverCors = () =>
  cors({
    origin: Bun.env.SERVER_HOST ?? 'http://localhost:8080',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
  })
