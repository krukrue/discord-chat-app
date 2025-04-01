import { sendMessage } from "@/server/actions/send-message";
import { uploadFile } from "@/server/upload-file/upload-file";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const chatId = formData.get("chatId") as string;
    const senderId = formData.get("senderId") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

    if (!chatId || !senderId || (!content && !file)) {
      return NextResponse.json({ message: "Не все обязательные поля заполнены" }, { status: 400 });
    }

    let fileUrl: string | null = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fileUrl = await uploadFile(buffer, file.name);
    }

    const message = await sendMessage(chatId, senderId, content, fileUrl);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    return NextResponse.json(
      { error: "Не удалось отправить сообщение" },
      { status: 500 }
    );
  }
}
