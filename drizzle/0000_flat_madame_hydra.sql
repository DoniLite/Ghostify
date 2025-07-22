CREATE TYPE "public"."FundingPriority" AS ENUM('P1', 'P2', 'P3', 'P4');--> statement-breakpoint
CREATE TYPE "public"."FundingProvider" AS ENUM('Stripe', 'PayPal', 'BankTransfer', 'Crypto', 'Wallet', 'Card');--> statement-breakpoint
CREATE TYPE "public"."KeyType" AS ENUM('Password', 'SecretKey', 'SessionKey', 'ApiKey', 'AccessToken', 'RefreshToken', 'TwoFactorCode', 'GoogleAuthCode', 'AppleAuthCode', 'GitHubAuthCode', 'DiscordAuthCode', 'TwitterAuthCode', 'InstagramAuthCode', 'LinkedInAuthCode', 'FacebookAuthCode', 'RedditAuthCode', 'PlatformKey');--> statement-breakpoint
CREATE TYPE "public"."NotificationType" AS ENUM('Alert', 'Reply', 'like', 'Post', 'Info', 'Message');--> statement-breakpoint
CREATE TYPE "public"."Permission" AS ENUM('User', 'Admin', 'Root');--> statement-breakpoint
CREATE TYPE "public"."Provider" AS ENUM('Google', 'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Ghostify');--> statement-breakpoint
CREATE TYPE "public"."Service" AS ENUM('Poster', 'CVMaker', 'APIs');--> statement-breakpoint
CREATE TYPE "public"."UserPlan" AS ENUM('Starter', 'Pro', 'Free');--> statement-breakpoint
CREATE TABLE "Admin" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"login" text NOT NULL,
	"password" text NOT NULL,
	"token" text NOT NULL,
	"activities" text,
	"connection" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "Admin_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE "Key" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"iv" text,
	"type" "KeyType" NOT NULL,
	"uid" text,
	"token" text,
	"userId" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "Key_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Contact" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"message" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "Contact_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "FundingDetails" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"priority" "FundingPriority" DEFAULT 'P1' NOT NULL,
	"type" "FundingProvider" NOT NULL,
	"details" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Wallet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"balance" real DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "Wallet_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "Notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"type" "NotificationType" NOT NULL,
	"content" text NOT NULL,
	"seen" boolean DEFAULT false NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Document" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"type" text NOT NULL,
	"downloadLink" text,
	"user_id" text,
	"postId" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Resume" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text,
	"type" text,
	"mode" text,
	"pdf" text,
	"screenshot" text,
	"metaData" text NOT NULL,
	"img" text,
	"default" boolean DEFAULT false NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"fullname" text,
	"password" text,
	"token" text,
	"service" text,
	"registration" timestamp DEFAULT now() NOT NULL,
	"permission" "Permission" DEFAULT 'User' NOT NULL,
	"api_access" boolean DEFAULT false NOT NULL,
	"api_credits" integer DEFAULT 300 NOT NULL,
	"resume_credits" integer DEFAULT 300 NOT NULL,
	"poster_credits" integer DEFAULT 300 NOT NULL,
	"provider" "Provider" DEFAULT 'Ghostify',
	"username" text,
	"avatar" text,
	"provider_id" text,
	"registered" boolean DEFAULT false NOT NULL,
	"plan" "UserPlan" DEFAULT 'Free' NOT NULL,
	"bio" text,
	"link" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_username_unique" UNIQUE("username"),
	CONSTRAINT "User_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FundingDetails" ADD CONSTRAINT "FundingDetails_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;