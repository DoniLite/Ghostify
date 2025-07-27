import * as T from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { keyTypeEnum } from './enums';
import { BaseRow, Timestamp } from './shared.schema';
import { UserTable } from './user.schema';

export const KeyTable = pgTable('Key', {
	...BaseRow,
	key: T.text('key'),
	iv: T.text('iv'),
	type: keyTypeEnum('type').notNull(),
	userId: T.text('userId').references(() => UserTable.id),
	...Timestamp,
});

export const AdminTable = pgTable('Admin', {
	...BaseRow,
	role: T.text('role').notNull(),
	login: T.text('login').unique().notNull(),
	password: T.text('password').notNull(),
	activities: T.json('activities'),
	connection: T.timestamp('connection'),
	...Timestamp,
});
