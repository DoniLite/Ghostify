import {
  deleteCookie,
  // getCookie,
  getSignedCookie,
  // setCookie,
  setSignedCookie
} from 'hono/cookie'
import { factory } from '../factory'

const OPEN_ROUTES = ['/home']
const AUTH_ROUTES = [
  '/poster/docs',
  '/poster/parser',
  '/poster/view',
  '/cv/maker',
  '/poster/new',
  '/service',
  '/poster/update/:post',
  '/poster/load/:uid'
]

export const ROUTES = [...OPEN_ROUTES, ...AUTH_ROUTES]

const isAuthRoute = (url: string) => AUTH_ROUTES.some((route) => url.includes(route))

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const redirectToSignIn = () => c.redirect('/login')
  const { connection_time } = await getSignedCookie(c, Bun.env.SIGNED_COOKIE_SECRET!)
  const session = c.get('session')
  try {
    // Vérification du temps de connexion
    if (
      connection_time &&
      typeof connection_time === 'string' &&
      Date.now() > Number(connection_time)
    ) {
      session.set('Auth', { authenticated: false })
      session.set('RedirectUrl', c.req.url)
      deleteCookie(c, 'connection_time')
      console.log(c.req.url)
      return isAuthRoute(c.req.url) ? redirectToSignIn() : await next()
    }

    // Vérification de l'authentification
    if (!session.get('Auth') || session.get('Auth')?.authenticated === false) {
      session.set('RedirectUrl', c.req.url)
      deleteCookie(c, 'connection_time')
      return isAuthRoute(c.req.url) ? redirectToSignIn() : await next()
    }

    // Renouvellement du token
    const cookieExpiration = new Date()
    cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15)

    session.set('Token', cookieExpiration.getTime().toString())

    await setSignedCookie(
      c,
      'connection_time',
      session.get('Token')!,
      Bun.env.SIGNED_COOKIE_SECRET!
    )

    await next()
  } catch (error) {
    console.error('Authentication middleware error:', error)
    session.set('RedirectUrl', c.req.url)
    console.log(c.req.url)
    return isAuthRoute(c.req.url) ? redirectToSignIn() : await next()
  }
})
