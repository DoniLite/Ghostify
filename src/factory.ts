import { createFactory } from 'hono/factory'
import type { JwtVariables } from 'hono/jwt'
import type { Variables } from '../server'

export const factory = createFactory<{
  Variables: Variables & JwtVariables
}>()
