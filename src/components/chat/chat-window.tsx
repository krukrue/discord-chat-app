import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChatsAndOtherUser } from "../../../types/chat";
import { useAuth } from "../auth/auth-context";
import Image from "next/image";
import ChatMembersModal from "./chat-members-modal";

interface ChatWindowProps {
  chat: ChatsAndOtherUser;
  onCloseChat?: () => void;
}

interface MessageType {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  file?: string;
}

export default function ChatWindow({ chat, onCloseChat }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3b82f6"); // default
  //const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

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
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [chat.id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`/api/chats/${chat.id}/update-image`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      console.log("Uploaded image URL:", data.url);
    }
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !file) || isSending) return;
    setIsSending(true);

    const formData = new FormData();
    formData.append("chatId", chat.id);
    formData.append("senderId", session.user?.id || "");
    formData.append("content", newMessage);
    if (file) formData.append("file", file);

    try {
      const optimisticMessage: MessageType = {
        id: `temp-${Date.now()}`,
        senderId: session.user?.id || "",
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage("");
      setFile(null);

      const { data } = await axios.post<MessageType>("/api/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) =>
          prev.map((msg) => (msg.id === optimisticMessage.id ? data : msg))
      );
    } catch (err) {
      setError("Не удалось отправить сообщение");
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith("temp-")));
    } finally {
      setIsSending(false);
    }
  };

  console.log("chat.isGroup:", chat.isGroup, typeof chat.isGroup);
    return (
        <div className="w-1/2 pl-4">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md rounded-lg p-4 flex flex-col h-[600px] max-h-screen transition-colors">
            {/* Заголовок + меню настроек */}
            <div className="flex justify-between items-center mb-4 relative">
              <h2 className="text-2xl font-semibold">
                {chat.otherUser?.name || "Group Chat"}
              </h2>

              <div className="flex items-center space-x-2 relative">
                <button
                    onClick={() => setShowOptionsMenu((prev) => !prev)}
                    className="text-gray-500 hover:text-black text-xl px-2"
                    title="Опции"
                >
                  ⋯
                </button>

                           <button
                            onClick={() => onCloseChat?.()}
                            className="text-gray-500 hover:text-black text-xl px-2"
                             title="Close chat"
                           >
                            ✕
                           </button>
                {showOptionsMenu && (
                    <div className="absolute top-8 right-0
   bg-white dark:bg-gray-800
   border dark:border-gray-700
   text-black dark:text-white
   rounded shadow-md p-3 z-10 space-y-3 w-52 text-sm">
                      {/* Палитра (всегда доступна) */}
                      <div>
                        <label className="block mb-1 text-gray-700 dark:text-gray-300">Chat Color:</label>
                        <div className="flex space-x-2">
                          {["#cf42ff", "#7818c6", "#09ddd5", "#6d28d9"].map((color, idx) => (
                              <button
                                  key={idx}
                                  onClick={() => handleColorChange(color)}
                                  className="w-6 h-6 rounded-full border-2"
                                  style={{ backgroundColor: color }}
                              />
                          ))}
                        </div>
                      </div>

                      {/* Только для групповых чатов */}
                      {chat.isGroup && (
                          <>
                            <div>
                              <label className="block mb-1 text-gray-700 dark:text-gray-300">Change chat image:</label>
                              <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file);
                                  }}
                                  className="w-full text-sm"
                              />
                            </div>

                            <div>
                              <button
                                  onClick={() => {
                                    setShowOptionsMenu(false);
                                    setShowMembersModal(true);
                                  }}
                                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600    dark:text-white px-3 py-1 rounded">
                                Manage Members
                              </button>
                            </div>
                          </>
                      )}

                    </div>
                )}

              </div>
            </div>

            {/* Модалка участников */}
            {chat.isGroup && (
                <ChatMembersModal
                    chatId={chat.id}
                    open={showMembersModal}
                    onClose={() => setShowMembersModal(false)}
                />
            )}

          {/* Список сообщений */}
          <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto border p-4 space-y-4"
          >
            {messages.map((msg) => {
              const isMe = msg.senderId === session.user?.id;
              const isPending = msg.id.startsWith("temp-");

              return (
                  <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} items-center`}
                  >
                    {!isMe && (
                        <Image
                            src={chat.otherUser.image}
                            alt={chat.otherUser.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                    )}

                    <div
                        className="p-3 rounded-lg max-w-xs"
                        style={{
                          backgroundColor: isMe
                              ? isPending
                                  ? "#93c5fd"
                                  : selectedColor
                              : "#e5e7eb",
                          color: isMe ? "white" : "black",
                        }}
                    >
                      <p>{msg.content}</p>
                      {msg.file && (
                          <div className="mt-2">
                            {msg.file.endsWith(".pdf") ? (
                                <a href={msg.file} target="_blank" rel="noopener noreferrer">
                                  PDF файл
                                </a>
                            ) : (
                                <Image
                                    src={msg.file}
                                    alt="File"
                                    width={200}
                                    height={200}
                                    className="max-w-xs mt-2"
                                />
                            )}
                          </div>
                      )}
                      <span className="text-xs text-gray-400 block mt-1">
                {isPending
                    ? "Отправляется..."
                    : new Date(msg.createdAt).toLocaleTimeString()}
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

          {/* Форма ввода */}
          <div className="mt-4 flex flex-col">
            <div className="flex mb-2">
              <input
                  type="text"
                  className="p-2 border rounded-lg w-full"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  disabled={isSending}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
