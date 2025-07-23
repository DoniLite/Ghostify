import * as T from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { fundingPriorityEnum, fundingProviderEnum } from './enums';
import { BaseRow, Timestamp } from './shared.schema';
import { UserTable } from './user.schema';

export const FundingDetailsTable = pgTable('FundingDetails', {
	...BaseRow,
	userId: T.text('user_id')
		.notNull()
		.references(() => UserTable.id),
	priority: fundingPriorityEnum('priority').default('P1').notNull(),
	type: fundingProviderEnum('type').notNull(),
	details: T.json('details'),
	...Timestamp,
});

export const WalletTable = pgTable('Wallet', {
	...BaseRow,
	userId: T.text('user_id')
		.unique()
		.references(() => UserTable.id),
	balance: T.real('balance').default(0.0).notNull(),
	currency: T.text('currency').default('USD').notNull(),
	...Timestamp,
});
