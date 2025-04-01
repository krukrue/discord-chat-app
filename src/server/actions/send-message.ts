import { eq } from "drizzle-orm";
import { db } from "..";
import { messages, chats } from "../schema";

export async function sendMessage(chatId: string, senderId: string, content: string, file?: string | null) {

  const newMessage = await db.insert(messages)
    .values({
      chatId,
      senderId,
      content,
      file
    })
    .returning();
  
  await db.update(chats)
    .set({
      lastMessage: content,
      lastMessageAt: new Date()
    })
    .where(eq(chats.id, chatId));
  
  return newMessage[0];
}