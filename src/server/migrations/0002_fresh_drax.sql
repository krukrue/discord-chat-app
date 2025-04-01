CREATE TABLE "chat" (
	"id" text PRIMARY KEY NOT NULL,
	"user1Id" text,
	"user2Id" text,
	"user1Avatar" text,
	"user2Avatar" text,
	"lastMessage" text,
	"lastMessageAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"chatId" text,
	"senderId" text,
	"content" text,
	"image" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user1Id_user_id_fk" FOREIGN KEY ("user1Id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user2Id_user_id_fk" FOREIGN KEY ("user2Id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_chatId_chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;