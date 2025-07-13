import { createFactory } from 'hono/factory';
import type { Variables } from '../server';

export const factory = createFactory<{
	Variables: Variables;
}>();
