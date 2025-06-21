import { factory } from '../factory'
import { loadKeys, saveKeys } from '../utils/security/cryptography'

const sessionMiddleware = factory.createMiddleware(async (c, next) => {
  const session = c.get('session')
  const keys = await loadKeys()
  if (!keys) {
    await saveKeys()
    session.set('ServerKeys', await loadKeys())
  }
  session.set('ServerKeys', keys)
  if (!session.get('Auth')) {
    session.set('Auth', {
      authenticated: false
    })
  }
  if (!session.get('Services')) {
    session.set('Services', {
      Platform: {
        internals: true,
        API: true
      }
    })
  }
  session.set('RedirectUrl', '/home')
  await next()
})

export default sessionMiddleware
