import type { AdminTable, KeyTable } from './admin.schema';
import type { ContactTable } from './contact.schema';
import type { FundingDetailsTable, WalletTable } from './funding.schema';
import type { NotificationTable } from './notification.schema';
import type {
	DocumentCommentTable,
	DocumentRevisionTable,
	DocumentTable,
	ResumeTable,
} from './service.schema';
import type { UserTable } from './user.schema';

export type Contact = typeof ContactTable.$inferSelect;
export type NewContact = typeof ContactTable.$inferInsert;

export type User = typeof UserTable.$inferSelect;
export type NewUser = typeof UserTable.$inferInsert;

export type FundingDetails = typeof FundingDetailsTable.$inferSelect;
export type NewFundingDetails = typeof FundingDetailsTable.$inferInsert;

export type Wallet = typeof WalletTable.$inferSelect;
export type NewWallet = typeof WalletTable.$inferInsert;

export type Key = typeof KeyTable.$inferSelect;
export type NewKey = typeof KeyTable.$inferInsert;

export type Admin = typeof AdminTable.$inferSelect;
export type NewAdmin = typeof AdminTable.$inferInsert;

export type Notifications = typeof NotificationTable.$inferSelect;
export type NewNotifications = typeof NotificationTable.$inferInsert;

export type Document = typeof DocumentTable.$inferSelect;
export type NewDocument = typeof DocumentTable.$inferInsert;

export type Resume = typeof ResumeTable.$inferSelect;
export type NewResume = typeof ResumeTable.$inferInsert;

export type Revision = typeof DocumentRevisionTable.$inferSelect;
export type NewRevision = typeof DocumentRevisionTable.$inferInsert;

export type Comment = typeof DocumentCommentTable.$inferSelect;
export type newComment = typeof DocumentCommentTable.$inferInsert;
