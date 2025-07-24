import * as T from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { revisionTypeEnum } from './enums';
import { BaseRow, Timestamp } from './shared.schema';
import { UserTable } from './user.schema';

export const DocumentTable = pgTable('Document', {
	...BaseRow,
	title: T.text('title'),
	type: T.text('type').notNull(),
	downloadLink: T.text('downloadLink'),
	userId: T.text('user_id').references(() => UserTable.id),
	version: T.text('version').$default(() => '0.0.1'),
	data: T.json('data'),
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

export const DocumentRevisionTable = pgTable('DocumentRevision', {
	...BaseRow,
	documentId: T.text('document_id').references(() => DocumentTable.id),
	authorId: T.text('author_id').references(() => UserTable.id),
	type: revisionTypeEnum().notNull(),
	content: T.text('content').notNull(),
	nodeKey: T.text('node_key').notNull(),
	accepted: T.boolean('accepted').default(false).notNull(),
	...Timestamp,
});

export const DocumentCommentTable = pgTable('DocumentComment', {
	...BaseRow,
	documentId: T.text('document_id').references(() => DocumentTable.id),
	authorId: T.text('author_id').references(() => UserTable.id),
	content: T.text('content').notNull(),
	resolved: T.boolean().default(false).notNull(),
	nodeKey: T.text('node_key').notNull(),
	parentId: T.text('parent_id'),
	...Timestamp,
});

export const UsersToDocumentTable = pgTable(
	'UsersToDocument',
	{
		documentId: T.text('document_id')
			.references(() => DocumentTable.id)
			.notNull(),
		userId: T.text('user_id')
			.references(() => UserTable.id)
			.notNull(),
	},
	(t) => [T.primaryKey({ columns: [t.documentId, t.userId] })],
);
