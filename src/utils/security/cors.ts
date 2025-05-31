/**
 * Middleware CORS for images
 * Allowed origins are sourced from the CORS_ORIGINS environment variable (comma-separated).
 */
export const allowedOrigins = Deno.env.get('CORS_ORIGINS')
  ? Deno.env.get('CORS_ORIGINS')!.split(',').map(origin => origin.trim())
  : [];