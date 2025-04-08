// src/app/api/chats/create/route.ts
import { NextResponse } from "next/server";
import { createChat, createGroupChat } from "@/server/actions/create-chat";
import { getUserByEmail } from "@/server/actions/get-user-by-email";

export async function POST(req: Request) {
  const { email, emails, userId, isGroup } = await req.json();

  if (!userId || (!isGroup && !email) || (isGroup && (!emails || emails.length < 1))) {
    return NextResponse.json({ message: "Неверные данные для создания чата" }, { status: 400 });
  }

  try {
    if (isGroup) {
      const chat = await createGroupChat(userId, emails);
      return NextResponse.json({ chat });
    } else {
      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ message: "User isn't found" }, { status: 404 });
      }

      const chat = await createChat(user.id, userId);
      return NextResponse.json({ chat: { ...chat, otherUser: user } });
    }
  } catch (err) {
    console.error("❌ SERVER ERROR (creating chat):", err); // ← добавлено
    return NextResponse.json(
        { message: "Ошибка сервера", error: (err as Error)?.message },
        { status: 500 }
    );
  }
}

