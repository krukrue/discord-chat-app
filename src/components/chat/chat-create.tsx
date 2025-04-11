// components/ChatCreate.tsx
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ChatsAndOtherUser } from "../../../types/chat";
import { useAuth } from "../auth/auth-context";

interface ChatCreateProps {
  onCreateChat: (chat: ChatsAndOtherUser) => void;
}

export default function ChatCreate({ onCreateChat }: ChatCreateProps) {

  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [tempEmail, setTempEmail] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const session = useAuth();


  const handleAddParticipant = () => {
    setError(null);
    if (!tempEmail || !/\S+@\S+\.\S+/.test(tempEmail)) {
      setError("Неверный формат email.");
      return;
    }
    if (participants.length >= 10) {
      setError("Нельзя добавить больше 10 пользователей в групповой чат.");
      return;
    }
    // Добавляем в список участников
    setParticipants((prev) => [...prev, tempEmail]);
    // Сброс поля ввода
    setTempEmail("");
  };



  const handleCreateChat = async () => {
    setError(null);

    try {
      // Если не группа — создаём «приватный» чат
      if (!isGroup) {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          setError("Неверный формат email.");
          return;
        }

        const response = await axios.post("/api/chats/create", {
          email,
          userId: session.user?.id,
          isGroup: false,
        });

        if (response.data) {
          onCreateChat(response.data);
        } else {
          setError("Чат с этим пользователем не найден.");
        }
      } else {
        // Если группа — отправляем массив участников
        if (participants.length === 0) {
          setError("Добавьте хотя бы одного участника.");
          return;
        }

        const invalid = participants.some(
            (em) => !/\S+@\S+\.\S+/.test(em)
        );
        if (invalid) {
          setError("Среди участников есть некорректный email.");
          return;
        }

        const response = await axios.post("/api/chats/create", {
          emails: participants, // массив
          userId: session.user?.id,
          isGroup: true,
        });

        if (response.data.chat) {
          onCreateChat(response.data.chat);
        } else {
          setError("Не удалось создать групповой чат.");
        }
      }
    } catch (err) {
      setError("Ошибка при создании чата.");
      console.error("Error creating chat:", err);
    }
  };


  return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Create chat
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat creation</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            {/* Переключатель Private или Group */}
            <div className="flex items-center space-x-4">
              <label>
                <input
                    type="radio"
                    checked={!isGroup}
                    onChange={() => {
                      setIsGroup(false);
                      setError(null);
                    }}
                />
                <span className="ml-2">Private Chat</span>
              </label>
              <label>
                <input
                    type="radio"
                    checked={isGroup}
                    onChange={() => {
                      setIsGroup(true);
                      setError(null);
                    }}
                />
                <span className="ml-2">Group Chat</span>
              </label>
            </div>

            {!isGroup && (
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Write email of user"
                    className="p-2 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white"
                />
            )}

            {isGroup && (
                <div className="space-y-2">
                  <div>
                    {/* Вывод участников */}
                    {participants.length > 0 && (
                        <ul className="mb-2">
                          {participants.map((p, i) => (
                              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                                {i + 1}. {p}
                              </li>
                          ))}
                        </ul>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        placeholder="Add participant email"
                        className="p-2 border rounded-lg flex-1 bg-white text-black dark:bg-gray-800 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={handleAddParticipant}
                        className="bg-gray-200 py-1 px-3 rounded text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      + Add participant
                    </button>
                  </div>
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700"
                onClick={handleCreateChat}
            >
              Add
            </button>
          </div>
        </DialogContent>
      </Dialog>
  );
}
