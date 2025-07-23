import * as T from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { BaseRow, Timestamp } from './shared.schema';

export const ContactTable = pgTable('Contact', {
	...BaseRow,
	email: T.text('email').unique().notNull(),
	name: T.text('name'),
	message: T.text('message'),
	...Timestamp,
});
