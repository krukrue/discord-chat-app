import { db } from "..";
import { chats, users, chatUsers } from "../schema";
import { eq, not, and, or, desc } from 'drizzle-orm';

export async function getUserChats(userId: string) {
  // Get all of the user's chats
  console.log("Getting chats");
  const userChats = await db.select({
    id: chatUsers.chatId,
    isGroup: chats.isGroup,
    lastMessage: chats.lastMessage,
    lastMessageAt: chats.lastMessageAt
  })
  .from(chatUsers)
  .leftJoin(chats, eq(chats.id, chatUsers.chatId))
  .where(eq(chatUsers.userId, userId))
  .orderBy(desc(chats.lastMessageAt))
  console.log("Got basic data");

  // Get more data about the chats (other user(s))
  const res = await Promise.all(userChats.map(async (chat) => {
    console.log("Loop");
    // Is the chat a group chat?
    if (chat.isGroup) {
      console.log("Group chat");
      //Get other group member names
      const groupUsers = await db.select({name: users.name})
      .from(chatUsers)
      .leftJoin(users, eq(users.id, chatUsers.userId))
      .where(
        and(
          eq(chatUsers.chatId, chat.id),
          not(eq(chatUsers.userId, userId))
        )
      )
      .limit(3);

      console.log("Generating group name");
      // If the group has 4+ members, make the name "userB, userC, ...", otherwise "userB and userC"
      // NOTE: If localisation is desirable, this probably shouldn't be here
      var groupName = "";
      if (groupUsers.length > 2)
        groupName = groupUsers[0].name + ", " + groupUsers[1].name + ", ...";
      else if (groupUsers.length == 2)
        groupName = groupUsers[0].name + ", " + groupUsers[1].name;
      else // Just in case something breaks
        groupName = "An unnamed group";
      
      console.log("Returning group chat data");
      return {
        ...chat,
        otherUser: {
          id: "GROUP",
          name: groupName,
          image: "groupImagePlaceholder"
        }
      };
    } else {
      console.log("DMs");
      const otherUserId = await db.select({id: chatUsers.userId})
      .from(chatUsers)
      .where(
        and(
          eq(chatUsers.chatId, chat.id),
          not(eq(chatUsers.userId, userId))
        )
      );

      console.log("Getting data about the 2nd user");
      // Some chats only have one member for some reason (testing?)
      const otherUser = await db.select({
        id: users.id,
        name: users.name,
        image: users.image
      })
      .from(users)
      .where(eq(users.id, (otherUserId.length > 0 ? otherUserId[0].id : userId)));

      console.log("Returning data");
      return {
        ...chat,
        otherUser: otherUser[0]
      };
    }
  }));

  console.log("Returning final result");
  return res;
}