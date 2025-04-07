import { createFactory } from 'hono/factory';
import { Variables } from '../server.tsx';
import type { JwtVariables } from 'hono/jwt';

export const factory = createFactory<{
  Variables: Variables & JwtVariables;
}>();