import { pgTable } from "drizzle-orm/pg-core";
import * as T from 'drizzle-orm/pg-core'
import { BaseRow, Timestamp } from "./shared.schema";
import { keyTypeEnum } from "./enums";
import { UserTable } from "./user.schema";

export const KeyTable = pgTable('Key', {
	...BaseRow,
	key: T.text('key'),
	iv: T.text('iv'),
	type: keyTypeEnum('type').notNull(),
	uid: T.text('uid').unique(),
	token: T.text('token'),
	userId: T.text('userId').references(() => UserTable.id),
    ...Timestamp
});

export const AdminTable = pgTable('Admin', {
	...BaseRow,
	role: T.text('role').notNull(),
	login: T.text('login').unique().notNull(),
	password: T.text('password').notNull(),
	token: T.text('token').notNull(),
	activities: T.text('activities'),
	connection: T.timestamp('connection'),
    ...Timestamp
});