import * as T from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { permissionEnum, providerEnum, userPlanEnum } from './enums';
import { BaseRow, Timestamp } from './shared.schema';

export const UserTable = pgTable('User', {
	...BaseRow,
	email: T.text('email').unique().notNull(),
	fullname: T.text('fullname'),
	password: T.text('password'),
	token: T.text('token'),
	service: T.text('service'),
	registration: T.timestamp('registration').defaultNow().notNull(),
	permission: permissionEnum('permission').notNull().default('User'),
	apiAccess: T.boolean('api_access').default(false).notNull(),
	apiCredits: T.integer('api_credits').default(300).notNull(),
	resumeCredits: T.integer('resume_credits').default(300).notNull(),
	posterCredits: T.integer('poster_credits').default(300).notNull(),
	provider: providerEnum('provider').default('Ghostify'),
	username: T.text('username').unique(),
	avatar: T.text('avatar'),
	providerId: T.text('provider_id').unique(),
	registered: T.boolean('registered').default(false).notNull(),
	plan: userPlanEnum('plan').default('Free').notNull(),
	bio: T.text('bio'),
	link: T.text('link'),
	...Timestamp,
});
