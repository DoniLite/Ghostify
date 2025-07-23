CREATE TYPE "public"."RevisionType" AS ENUM('insert', 'format', 'delete');--> statement-breakpoint
CREATE TABLE "DocumentComment" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text,
	"author_id" text,
	"content" text NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"node_key" text NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "DocumentRevision" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text,
	"author_id" text,
	"type" "RevisionType" NOT NULL,
	"content" text NOT NULL,
	"node_key" text NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "UsersToDocument" (
	"document_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "UsersToDocument_document_id_user_id_pk" PRIMARY KEY("document_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "version" text;--> statement-breakpoint
ALTER TABLE "DocumentComment" ADD CONSTRAINT "DocumentComment_document_id_Document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."Document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DocumentComment" ADD CONSTRAINT "DocumentComment_author_id_User_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DocumentRevision" ADD CONSTRAINT "DocumentRevision_document_id_Document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."Document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DocumentRevision" ADD CONSTRAINT "DocumentRevision_author_id_User_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UsersToDocument" ADD CONSTRAINT "UsersToDocument_document_id_Document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."Document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UsersToDocument" ADD CONSTRAINT "UsersToDocument_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;