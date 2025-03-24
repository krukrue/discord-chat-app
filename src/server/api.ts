import { db } from 'server/index';
import { sql, eq, desc } from 'drizzle-orm';
import { users, chats, messages } from "server/schema";

export async function getUser(id: string) {
    const currentUser = false; // TODO: Figure out how to check this
    var result;
    // The user should not be able to get other users' emails
    if (currentUser) {
        result = await db.select({
            id: users.id,
            name: users.name,
            image: users.image})
            .from(users)
            .where(eq(users.id, id));
    } else {
        result = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image})
            .from(users)
            .where(eq(users.id, id));
    }
    return result[0];
}

export async function getUserChats(id: string) {
    // TODO: Order these correctly
    // Check for both user1 and user2
    var result = await db.select({
        id: chats.id,
        userId: users.id,
        name: users.name,
        image: chats.user2Avatar,
        lastMessage: chats.lastMessage,
        lastMessageAt: chats.lastMessageAt})
        .from(chats)
        .leftJoin(users, eq(chats.user2Id, users.id))
        .where(eq(chats.user1Id, id));
    var result2 = await db.select({
        id: chats.id,
        userId: users.id,
        name: users.name,
        image: chats.user1Avatar,
        lastMessage: chats.lastMessage,
        lastMessageAt: chats.lastMessageAt})
        .from(chats)
        .leftJoin(users, eq(chats.user1Id, users.id))
        .where(eq(chats.user2Id, id));
    // Combine results
    for (var x in result2)
        result.push(result2[x]);
    return result;
}

export async function getMessages(id: string) {
    const result = await db.select({
        id: messages.id,
        senderId: messages.senderId,
        content: messages.content,
        image: messages.image,
        at: messages.createdAt})
        .from(messages)
        .where(eq(messages.chatId, id))
        .orderBy(desc(messages.createdAt))
        .limit(64);
    return result.reverse();
    // .reverse since I'm guessing the messages will be added from oldest to newest in the front-end
}

export async function getMessagesOffset(id: string, offset: number) {
    const result = await db.select({
        id: messages.id,
        senderId: messages.senderId,
        content: messages.content,
        image: messages.image,
        at: messages.createdAt})
        .from(messages)
        .where(eq(messages.chatId, id))
        .orderBy(desc(messages.createdAt))
        .offset(offset)
        .limit(64);
    return result.reverse();
}

export async function addMessage(chatId: string, sender: string, content: string, image: string) {
    db.insert(messages)
        .values({
            chatId: chatId,
            senderId: sender,
            content: content,
            image: image,
            createdAt: sql`NOW()`
        });
}

export async function updateChat(id: string, message: string) {
    db.update(chats)
        .set({
            lastMessage: message,
            lastMessageAt: sql`NOW()`})
        .where(eq(chats.id, id));
}

export async function updateMessage(id: string, content: string, image: string) {
    db.update(messages)
        .set({
            content: content,
            image: image})
        .where(eq(messages.id, id));
}

export async function deleteChat(id: string) {
    db.delete(chats)
        .where(eq(chats.id, id));
}

export async function deleteMessage(id: string) {
    db.delete(messages)
        .where(eq(messages.id, id));
}