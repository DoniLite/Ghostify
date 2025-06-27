import { sign, verify } from 'hono/jwt'

export const verifyJWT = async (token: string) => {
  return await verify(token, Bun.env.JWT_SECRET!)
}

export const tokenGenerator = async <T extends Record<string, unknown>>(payload: T) => {
  return await sign(payload, Bun.env.JWT_SECRET!)
}
