// components/chat/chat-members-modal.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface ChatMembersModalProps {
    chatId: string;
    open: boolean;
    onClose: () => void;
}

interface Member {
    id: string;
    nickname: string;
    avatarUrl?: string;
}

export default function ChatMembersModal({ chatId, open, onClose }: ChatMembersModalProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            fetchMembers();
        }
    }, [open]);

    const fetchMembers = async () => {
        try {
            setError(null);
            // Допустим, есть эндпоинт /api/chats/{chatId}/members
            const { data } = await axios.get(`/api/chats/${chatId}/members`);
            setMembers(data);
        } catch (err) {
            setError("Не удалось загрузить участников");
            console.error(err);
        }
    };

    const handleRemove = async (userId: string) => {
        try {
            setError(null);
            // Допустим, DELETE /api/chats/{chatId}/members?userId=xxx
            await axios.delete(`/api/chats/${chatId}/members`, {
                data: { userId },
            });
            setMembers((prev) => prev.filter((m) => m.id !== userId));
        } catch (err) {
            setError("Ошибка при удалении участника");
            console.error(err);
        }
    };

    const handleAdd = async () => {
        try {
            setError(null);
            if (!/\S+@\S+\.\S+/.test(newEmail)) {
                setError("Неверный формат email");
                return;
            }
            // Допустим, POST /api/chats/{chatId}/members
            const { data } = await axios.post(`/api/chats/${chatId}/members`, {
                email: newEmail,
            });
            setMembers((prev) => [...prev, data]);
            setNewEmail("");
        } catch (err) {
            setError("Ошибка при добавлении участника");
            console.error(err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-md w-96 relative">
                <button className="absolute right-2 top-2 text-xl" onClick={onClose}>×</button>
                <h2 className="text-xl font-bold mb-2">Group Members</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}

                <ul className="mb-4">
                    {members.map((m) => (
                        <li key={m.id} className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <img
                                    src={m.avatarUrl || "/default-avatar.png"}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span>{m.nickname}</span>
                            </div>
                            <button
                                onClick={() => handleRemove(m.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="flex space-x-2">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="New user's email"
                        className="flex-1 p-1 border rounded"
                    />
                    <button onClick={handleAdd} className="bg-blue-500 text-white px-3 py-1 rounded">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
