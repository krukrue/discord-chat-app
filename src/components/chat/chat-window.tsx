import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChatsAndOtherUser } from "../../../types/chat";
import { useAuth } from "../auth/auth-context";
import Image from "next/image";

interface ChatWindowProps {
  chat: ChatsAndOtherUser;
}

interface MessageType {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  file?: string;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const session = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get<MessageType[]>(`/api/chats/${chat.id}/messages`);
      setMessages(data);
    } catch (error) {
      setError("Ошибка при загрузке сообщений");
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [chat.id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if ((!newMessage.trim() && !file) || isSending) return;
    setIsSending(true);

    const formData = new FormData();
    formData.append("chatId", chat.id);
    formData.append("senderId", session.user?.id);
    formData.append("content", newMessage);
    if (file) {
      formData.append("file", file);
    }

    try {
      const optimisticMessage: MessageType = {
        id: `temp-${Date.now()}`,
        senderId: session.user?.id || '',
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage("");
      setFile(null);

      const { data } = await axios.post<MessageType>("/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessages(prev =>
        prev.map(msg => msg.id === optimisticMessage.id ? data : msg)
      );
    } catch (err) {
      setError("Не удалось отправить сообщение");
      console.error("Error sending message:", err);

      setMessages(prev =>
        prev.filter(msg => !msg.id.startsWith('temp-'))
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-1/2 pl-4">
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full">
        <h2 className="text-2xl font-semibold mb-4">{chat.otherUser.name}</h2>
        <div
          ref={messagesContainerRef}
          className="flex-1 h-96 overflow-y-auto border p-4 space-y-4"
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === session.user?.id;
            const isPending = msg.id.startsWith('temp-');

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-center`}>
                {!isMe && (
                  <Image
                    src={chat.otherUser.image}
                    alt={chat.otherUser.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div className={`p-3 rounded-lg max-w-xs ${
                  isMe 
                    ? isPending 
                      ? "bg-blue-300 text-white"
                      : "bg-blue-500 text-white" 
                    : "bg-gray-200 text-black"
                }`}>
                  <p>{msg.content}</p>
                  {msg.file && (
                    <div className="mt-2">
                      {msg.file.endsWith(".pdf") ? (
                        <a href={msg.file} target="_blank" rel="noopener noreferrer">PDF файл</a>
                      ) : (
                        <Image src={msg.file} alt="File" width={200} height={200} className="max-w-xs mt-2" />
                      )}
                    </div>
                  )}
                  <span className="text-xs text-gray-300 block mt-1">
                    {isPending 
                      ? "Отправляется..." 
                      : new Date(msg.createdAt).toLocaleTimeString()
                    }
                  </span>
                </div>
                {isMe && (
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    alt="Me"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-col">
          <div className="flex mb-2">
            <input
              type="text"
              className="p-2 border rounded-lg w-full"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              disabled={isSending}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
            <button
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              onClick={sendMessage}
              disabled={isSending}
              >
              {isSending ? "Отправка..." : "Отправить"}
            </button>
          </div>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className=""
            disabled={isSending}
            />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
