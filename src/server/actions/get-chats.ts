import { db } from "..";
import { chats, users } from "../schema";
import { eq, or, desc } from 'drizzle-orm';

export async function getUserChats(userId: string) {
  const userChats = await db.select({
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
  .where(or(
    eq(chats.user1Id, userId),
    eq(chats.user2Id, userId)
  ))
  .orderBy(desc(chats.lastMessageAt));

  const enhancedChats = await Promise.all(userChats.map(async (chat) => {

    if (chat.isGroup) {
      return {
        ...chat,
        otherUser: {
          id: "group",
          name: "Group Chat",
          image: chat.groupAvatar || "/groupchat.png"
        }
      };
    }


    const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
    
    const otherUser = await db.select({
      id: users.id,
      name: users.name,
      image: users.image
    })
    .from(users)
    .where(eq(users.id, otherUserId!))
    .limit(1);
    
    return {
      ...chat,
      otherUser: otherUser[0]
    };
  }));
  
  return enhancedChats;
}