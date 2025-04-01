"use client";
import { useAuth } from "@/components/auth/auth-context";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChatsAndOtherUser } from "../../types/chat";
import ChatWindow from "@/components/chat/chat-window";
import ChatList from "@/components/chat/chat-list";


export default function Home() {
  const session = useAuth();
  const [chats, setChats] = useState<ChatsAndOtherUser[]>();
  const [selectedChat, setSelectedChat] = useState<ChatsAndOtherUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (session?.user?.id) {
          const { data } = await axios.get<ChatsAndOtherUser[]>(`/api/user/${session.user.id}/chats`);
          setChats(data ?? []);
        }
      } catch (error) {
        setError("Failed to fetch chats");
      }
    };

    fetchChats();
  }, [session]);

  return (
    <div className="flex min-h-screen bg-gray-50 p-8">
      {error && (
        <div className="bg-red-200 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {(session && chats) ? (
        <>
          {/* Список чатов (левая часть) */}
          <ChatList chats={chats} onSelectChat={setSelectedChat} />

          {/* Окно чата (правая часть) */}
          {selectedChat && <ChatWindow chat={selectedChat} />}
        </>
      ) : (
        <p className="text-center text-gray-500 w-full">You need to sign in to see your chats.</p>
      )}
    </div>
  );
}
