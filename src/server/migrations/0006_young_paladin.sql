ALTER TABLE "feed" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "group" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "feed" CASCADE;--> statement-breakpoint
DROP TABLE "group" CASCADE;--> statement-breakpoint
ALTER TABLE "chat_members" RENAME COLUMN "groupId" TO "chatId";--> statement-breakpoint
ALTER TABLE "chat_members" DROP CONSTRAINT "chat_members_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chatId_chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;