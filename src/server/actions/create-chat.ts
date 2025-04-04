import { or, and, eq } from "drizzle-orm";
import { db } from "..";
import { chats, users } from "../schema";

export async function createChat(user1Id: string, user2Id: string) {
  const existingChat = await db.select({ id: chats.id })
    .from(chats)
    .where(
      or(
        and(eq(chats.user1Id, user1Id), eq(chats.user2Id, user2Id)),
        and(eq(chats.user1Id, user2Id), eq(chats.user2Id, user1Id))
      )
    )
    .limit(1);

  if (existingChat.length > 0) {
    return { 
      message: "Чат уже существует", 
      chatId: existingChat[0].id, 
      isNew: false 
    };
  }

  const user1 = await db.select({
    id: users.id,
    avatar: users.image,
    name: users.name
  })
  .from(users)
  .where(eq(users.id, user1Id))
  .limit(1);

  const user2 = await db.select({
    id: users.id,
    avatar: users.image,
    name: users.name
  })
  .from(users)
  .where(eq(users.id, user2Id))
  .limit(1);

  if (user1.length === 0 || user2.length === 0) {
    throw new Error("Один или оба пользователя не существуют.");
  }

  const newChat = await db.insert(chats)
    .values({
      user1Id,
      user2Id,
      user1Avatar: user1[0]?.avatar || null,
      user2Avatar: user2[0]?.avatar || null,
      lastMessage: "",
    })
    .returning();

  return { 
    ...newChat[0],
    isNew: true 
  };
}
