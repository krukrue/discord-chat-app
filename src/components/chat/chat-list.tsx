"use client"
import Image from "next/image";
import { ChatsAndOtherUser } from "../../../types/chat";
import { Dispatch, SetStateAction, useState } from "react";
import ChatCreate from "./chat-create";

interface ChatListProps {
  chats: ChatsAndOtherUser[];
  onSelectChat: Dispatch<SetStateAction<ChatsAndOtherUser | null>>
}

export default function ChatList({ chats, onSelectChat }: ChatListProps) {
  const [chatList, setChatList] = useState<ChatsAndOtherUser[]>(chats);
  function onCreateChat (newChat: ChatsAndOtherUser) {
    setChatList((prevChats) => [...prevChats, newChat]);
  }
  console.log(chatList, chats)
  return (
    <div className="w-1/2 border-r border-gray-300 pr-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Your Chats</h1>
      <ChatCreate onCreateChat={onCreateChat} />
      <ul className="space-y-4">
        {chatList.map((chat) => (
          <li
            key={chat.id}
            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => onSelectChat(chat)}
          >
            <Image
              src={chat.otherUser.image}
              alt={chat.otherUser.name}
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
              priority
            />
            <div className="flex-1">
              <h2 className="font-medium text-xl">{chat.otherUser.name}</h2>
              <p className="text-gray-500 text-sm">{chat.lastMessage || "No messages yet"}</p>
              <span className="text-gray-400 text-xs">
                {new Date(chat.lastMessageAt ?? "").toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
