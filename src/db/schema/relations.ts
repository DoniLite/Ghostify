import { relations } from "drizzle-orm/relations";
import { UserTable } from "./user.schema";
import { KeyTable } from "./admin.schema";
import { NotificationTable } from "./notification.schema";
import { DocumentTable, ResumeTable } from "./service.schema";
import { FundingDetailsTable, WalletTable } from "./funding.schema";

export const userRelations = relations(UserTable, ({ many, one }) => ({
	keys: many(KeyTable),
	notifications: many(NotificationTable),
	resumes: many(ResumeTable),
	documents: many(DocumentTable),
	fundingDetails: many(FundingDetailsTable),
	wallet: one(WalletTable),
}));

export const keyRelations = relations(KeyTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [KeyTable.userId],
		references: [UserTable.id],
	}),
}));

export const notificationsRelations = relations(NotificationTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [NotificationTable.userId],
		references: [UserTable.id],
	}),
}));

export const documentRelations = relations(DocumentTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [DocumentTable.userId],
		references: [UserTable.id],
	}),
}));

export const resumeRelations = relations(ResumeTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [ResumeTable.userId],
		references: [UserTable.id],
	}),
}));

export const fundingDetailsRelations = relations(FundingDetailsTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [FundingDetailsTable.userId],
		references: [UserTable.id],
	}),
}));

export const walletRelations = relations(WalletTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [WalletTable.userId],
		references: [UserTable.id],
	}),
}));