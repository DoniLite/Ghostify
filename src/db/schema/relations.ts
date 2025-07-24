import { relations } from 'drizzle-orm/relations';
import { KeyTable } from './admin.schema';
import { FundingDetailsTable, WalletTable } from './funding.schema';
import { NotificationTable } from './notification.schema';
import {
	DocumentCommentTable,
	DocumentRevisionTable,
	DocumentTable,
	ResumeTable,
	UsersToDocumentTable,
} from './service.schema';
import { UserTable } from './user.schema';

export const userRelations = relations(UserTable, ({ many, one }) => ({
	keys: many(KeyTable),
	notifications: many(NotificationTable),
	resumes: many(ResumeTable),
	documents: many(DocumentTable),
	comments: many(DocumentCommentTable),
	revisions: many(DocumentRevisionTable),
	fundingDetails: many(FundingDetailsTable),
	documentsToUsers: many(UsersToDocumentTable),
	wallet: one(WalletTable),
}));

export const keyRelations = relations(KeyTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [KeyTable.userId],
		references: [UserTable.id],
	}),
}));

export const notificationsRelations = relations(
	NotificationTable,
	({ one }) => ({
		user: one(UserTable, {
			fields: [NotificationTable.userId],
			references: [UserTable.id],
		}),
	}),
);

export const documentRelations = relations(DocumentTable, ({ one, many }) => ({
	user: one(UserTable, {
		fields: [DocumentTable.userId],
		references: [UserTable.id],
	}),
	revisions: many(DocumentRevisionTable),
	comments: many(DocumentCommentTable),
	users: many(UsersToDocumentTable),
}));

export const resumeRelations = relations(ResumeTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [ResumeTable.userId],
		references: [UserTable.id],
	}),
}));

export const fundingDetailsRelations = relations(
	FundingDetailsTable,
	({ one }) => ({
		user: one(UserTable, {
			fields: [FundingDetailsTable.userId],
			references: [UserTable.id],
		}),
	}),
);

export const walletRelations = relations(WalletTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [WalletTable.userId],
		references: [UserTable.id],
	}),
}));

export const documentCommentRelations = relations(
	DocumentCommentTable,
	({ one }) => ({
		document: one(DocumentTable, {
			fields: [DocumentCommentTable.documentId],
			references: [DocumentTable.id],
		}),
		author: one(UserTable, {
			fields: [DocumentCommentTable.authorId],
			references: [UserTable.id],
		}),
		parent: one(DocumentCommentTable, {
			fields: [DocumentCommentTable.parentId],
			references: [DocumentCommentTable.id],
		}),
	}),
);

export const documentRevisionRelations = relations(
	DocumentRevisionTable,
	({ one }) => ({
		document: one(DocumentTable, {
			fields: [DocumentRevisionTable.documentId],
			references: [DocumentTable.id],
		}),
		author: one(UserTable, {
			fields: [DocumentRevisionTable.authorId],
			references: [UserTable.id],
		}),
	}),
);

export const usersToDocumentRelations = relations(
	UsersToDocumentTable,
	({ one }) => ({
		document: one(DocumentTable, {
			fields: [UsersToDocumentTable.documentId],
			references: [DocumentTable.id],
		}),
		user: one(UserTable, {
			fields: [UsersToDocumentTable.userId],
			references: [UserTable.id],
		}),
	}),
);
