ALTER TABLE "User" RENAME COLUMN "api_credits" TO "credits";--> statement-breakpoint
ALTER TABLE "Key" DROP CONSTRAINT "Key_uid_unique";--> statement-breakpoint
ALTER TABLE "Admin" ALTER COLUMN "activities" SET DATA TYPE json USING activities::json;--> statement-breakpoint
ALTER TABLE "Admin" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "Key" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "Key" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "resume_credits";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "poster_credits";