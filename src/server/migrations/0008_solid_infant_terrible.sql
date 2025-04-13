CREATE TABLE "userSubscribe" (
	"groupId" text,
	"userId" text
);
--> statement-breakpoint
ALTER TABLE "chat_members" RENAME COLUMN "groupId" TO "chatId";--> statement-breakpoint
ALTER TABLE "chat_members" DROP CONSTRAINT "chat_members_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "userSubscribe" ADD CONSTRAINT "userSubscribe_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userSubscribe" ADD CONSTRAINT "userSubscribe_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chatId_chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;