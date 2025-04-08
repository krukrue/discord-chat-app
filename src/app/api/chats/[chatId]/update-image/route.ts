import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/server";
import { chats } from "@/server/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    const fileUrl = `/uploads/${fileName}`;

    await writeFile(filePath, buffer);

    await db.update(chats)
        .set({ groupAvatar: fileUrl })
        .where(eq(chats.id, params.chatId));

    return NextResponse.json({ url: fileUrl });
}
