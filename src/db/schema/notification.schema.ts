import { pgTable } from "drizzle-orm/pg-core";
import * as T from 'drizzle-orm/pg-core';
import { BaseRow, Timestamp } from "./shared.schema";
import { notificationTypeEnum } from "./enums";
import { UserTable } from "./user.schema";

export const NotificationTable = pgTable('Notifications', {
	...BaseRow,
	title: T.text('title'),
	type: notificationTypeEnum('type').notNull(),
	content: T.text('content').notNull(),
	seen: T.boolean('seen').default(false).notNull(),
	userId: T.text('user_id').references(() => UserTable.id),
    ...Timestamp
});