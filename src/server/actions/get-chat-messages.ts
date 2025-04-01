import { eq, asc } from "drizzle-orm";
import { db } from "..";
import { messages } from "../schema";

export async function getChatMessages(chatId: string) {
  
  const chatMessages = await db.select({
    id: messages.id,
    chatId: messages.chatId,
    senderId: messages.senderId,
    content: messages.content,
    file: messages.file,
    createdAt: messages.createdAt
  })
  .from(messages)
  .where(eq(messages.chatId, chatId))
  .orderBy(asc(messages.createdAt));
  
  return chatMessages;
}