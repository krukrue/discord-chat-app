CREATE TABLE "chat_members" (
	"groupId" text,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE "feed" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"content" text,
	"userId" text,
	"file" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"private" boolean,
	"userId" text
);
--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "image" TO "file";--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "groupAvatar" text;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "isGroup" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed" ADD CONSTRAINT "feed_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed" ADD CONSTRAINT "feed_userId_group_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;