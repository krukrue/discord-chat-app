import { createChat } from "./create-chat";
import { getChatMessages } from "./get-chat-messages";
import { getUserChats } from "./get-chats";
import { getUserById } from "./get-user";
import { sendMessage } from "./send-message";

export const chatService = {
  getUserById,
  getUserChats,
  createChat,
  getChatMessages,
  sendMessage
};