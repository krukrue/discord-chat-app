import { createChat } from "@/server/actions/create-chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { user1Id, user2Id } = body;

  if (!user1Id || !user2Id) {
    return NextResponse.json(
      { message: 'Требуются оба ID пользователей' },
      { status: 400 }
    );
  }
  
  const result = await createChat(user1Id, user2Id);
  return NextResponse.json(result);
}