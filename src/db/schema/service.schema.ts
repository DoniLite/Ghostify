import * as T from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { BaseRow, Timestamp } from './shared.schema';
import { UserTable } from './user.schema';

export const DocumentTable = pgTable('Document', {
	...BaseRow,
	title: T.text('title'),
	type: T.text('type').notNull(),
	downloadLink: T.text('downloadLink'),
	userId: T.text('user_id').references(() => UserTable.id),
	postId: T.integer('postId'),
	...Timestamp,
});

export const ResumeTable = pgTable('Resume', {
	...BaseRow,
	url: T.text('url'),
	type: T.text('type'),
	mode: T.text('mode'),
	pdf: T.text('pdf'),
	screenshot: T.text('screenshot'),
	metaData: T.text('metaData').notNull(),
	img: T.text('img'),
	default: T.boolean('default').default(false).notNull(),
	userId: T.text('user_id').references(() => UserTable.id),
	...Timestamp,
});
