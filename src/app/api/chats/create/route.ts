// src/app/api/chats/create/route.ts
import { NextResponse } from "next/server";
import { createChat } from "@/server/actions/create-chat";
import { getUserByEmail } from "@/server/actions/get-user-by-email";

export async function POST(req: Request) {
  const { email, userId } = await req.json();

  if (!email || !userId) {
    return NextResponse.json({ message: "Need to fill email and userId" }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  
  if (!user) {
    return NextResponse.json({ message: "User isn't found" }, { status: 404 });
  }

  const chat = await createChat(user.id, userId);

  return NextResponse.json({ ...chat, otherUser: user });
}

