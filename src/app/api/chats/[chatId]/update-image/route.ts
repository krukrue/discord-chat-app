import { db } from "@/server";
import { chats } from "@/server/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { uploadFile } from "@/server/upload-file/upload-file";

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file)
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    try {
        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        const fileUrl = await uploadFile(buffer, file.name);

        await db.update(chats)
            .set({ groupAvatar: fileUrl })
            .where(eq(chats.id, params.chatId));

        return NextResponse.json({ url: fileUrl });
    } catch (e: any) {
        return NextResponse.json({ error: "File upload failed: " + e.message }, { status: 500 });
    }
}