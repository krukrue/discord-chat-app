import { getChatMessages } from "@/server/actions/get-chat-messages";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  const chatId = params.chatId;  
  const messages = await getChatMessages(chatId);
  return NextResponse.json(messages);
}