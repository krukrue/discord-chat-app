ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_user1Id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_user2Id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "message_senderId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user1Id_user_id_fk" FOREIGN KEY ("user1Id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user2Id_user_id_fk" FOREIGN KEY ("user2Id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");