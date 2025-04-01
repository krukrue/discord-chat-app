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
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const session = useAuth();

  const handleCreateChat = async () => {
    try {
      setError(null);
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError("Неверный формат email.");
        return;
      }
  
      const response = await axios.post("/api/chats/create", {
        email,
        userId: session.user?.id,
      });
  
      if (response.data.chat) {
        onCreateChat(response.data.chat);
      } else {
        setError("Чат с этим пользователем не найден.");
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Write email of user"
            className="p-2 border rounded-lg"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={handleCreateChat}
          >
            Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
