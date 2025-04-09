import { db } from "..";
import { chats, users, chatMembers } from "../schema";
import { eq, or, desc, and } from 'drizzle-orm';

export async function getUserChats(userId: string) {
  // Приватные чаты
  const privateChats = await db.select({
    id: chats.id,
    user1Id: chats.user1Id,
    user2Id: chats.user2Id,
    user1Avatar: chats.user1Avatar,
    user2Avatar: chats.user2Avatar,
    lastMessage: chats.lastMessage,
    lastMessageAt: chats.lastMessageAt,
    isGroup: chats.isGroup,
    groupAvatar: chats.groupAvatar,
  })
      .from(chats)
      .where(and(
          eq(chats.isGroup, false),
          or(eq(chats.user1Id, userId), eq(chats.user2Id, userId))
      ));

  // Групповые чаты, в которых пользователь состоит
  const groupChats = await db.select({
    id: chats.id,
    user1Id: chats.user1Id,
    user2Id: chats.user2Id,
    user1Avatar: chats.user1Avatar,
    user2Avatar: chats.user2Avatar,
    lastMessage: chats.lastMessage,
    lastMessageAt: chats.lastMessageAt,
    isGroup: chats.isGroup,
    groupAvatar: chats.groupAvatar,
  })
      .from(chats)
      .innerJoin(chatMembers, eq(chats.id, chatMembers.chatId))
      .where(and(
          eq(chatMembers.userId, userId),
          eq(chats.isGroup, true)
      ));

  const allChats = [...privateChats, ...groupChats];

  const enhancedChats = await Promise.all(
      allChats.map(async (chat) => {
        if (chat.isGroup) {
          return {
            ...chat,
            otherUser: {
              id: "group",
              name: "Group Chat",
              image: chat.groupAvatar || "/groupchat.png",
            },
          };
        }

        const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
        const otherUser = await db.select({
          id: users.id,
          name: users.name,
          image: users.image,
        })
            .from(users)
            .where(eq(users.id, otherUserId!))
            .limit(1);

        return {
          ...chat,
          otherUser: otherUser[0],
        };
      })
  );

  return enhancedChats.sort((a, b) =>
      new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime()
  );
}
