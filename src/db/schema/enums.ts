import { pgEnum } from "drizzle-orm/pg-core";

export const userPlanEnum = pgEnum('UserPlan', ['Starter', 'Pro', 'Free']);
export const serviceEnum = pgEnum('Service', ['Poster', 'CVMaker', 'APIs']);
export const permissionEnum = pgEnum('Permission', ['User', 'Admin', 'Root']);
export const providerEnum = pgEnum('Provider', [
	'Google',
	'Facebook',
	'Twitter',
	'Instagram',
	'LinkedIn',
	'Ghostify',
]);
export const keyTypeEnum = pgEnum('KeyType', [
	'Password',
	'SecretKey',
	'SessionKey',
	'ApiKey',
	'AccessToken',
	'RefreshToken',
	'TwoFactorCode',
	'GoogleAuthCode',
	'AppleAuthCode',
	'GitHubAuthCode',
	'DiscordAuthCode',
	'TwitterAuthCode',
	'InstagramAuthCode',
	'LinkedInAuthCode',
	'FacebookAuthCode',
	'RedditAuthCode',
	'PlatformKey',
]);
export const notificationTypeEnum = pgEnum('NotificationType', [
	'Alert',
	'Reply',
	'like',
	'Post',
	'Info',
	'Message',
]);
export const fundingPriorityEnum = pgEnum('FundingPriority', [
	'P1',
	'P2',
	'P3',
	'P4',
]);
export const fundingProviderEnum = pgEnum('FundingProvider', [
	'Stripe',
	'PayPal',
	'BankTransfer',
	'Crypto',
	'Wallet',
	'Card',
]);
