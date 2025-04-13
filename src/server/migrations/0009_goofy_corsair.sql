ALTER TABLE "feed" DROP CONSTRAINT "feed_userId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "feed" ADD COLUMN "groupId" text;--> statement-breakpoint
ALTER TABLE "feed" ADD CONSTRAINT "feed_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;