import { or, and, eq } from "drizzle-orm";
import { db } from "..";
import { chats, users, chatUsers } from "../schema";

export async function createChat(user1Id: string, user2Id: string) {
  const existingChat = await db.select({id: chatUsers.chatId})
  .from(chatUsers)
  .leftJoin(chats, eq(chats.id, chatUsers.chatId))
  .where(
    and(
      or(
        and(
          eq(chats.user1Id, user1Id),
          eq(chatUsers.userId, user2Id)
        ),
        and(
          eq(chats.user1Id, user2Id),
          eq(chatUsers.userId, user1Id)
        )
      ),
      eq(chats.isGroup, false)
    )
  );

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
      lastMessage: "",
    })
    .returning();

  const newChatUsers = await db.insert(chatUsers)
  .values([{
    chatId: newChat[0].id,
    userId: user1[0].id,
    avatar: user1[0].avatar
  }, {
    chatId: newChat[0].id,
    userId: user2[0].id,
    avatar: user2[0].avatar
  }])
  .returning();

  const res = {
    user1Id: newChatUsers[0].userId,
    user2Id: newChatUsers[1].userId,
    user1Avatar: newChatUsers[0].avatar,
    user2Avatar: newChatUsers[1].avatar,
    lastMessage: newChat[0].lastMessage
  };

  return { 
    ...res,
    isNew: true 
  };
}
