import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { feed, group } from "@/server/schema"
import { db } from "@/server"
import { uploadFile } from "@/server/upload-file/upload-file"

export async function POST(req: Request) {
  try {
    // Получаем formData
    const formData = await req.formData()

    // Извлекаем данные из formData
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const groupId = formData.get("groupId") as string
    const userId = formData.get("userId") as string
    const file = formData.get("file") as File | null;

    // Проверяем, существует ли группа
    const groupExists = await db
      .select()
      .from(group)
      .where(eq(group.id, groupId))

    if (!(groupExists.length > 0)) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    // Сохраняем файл, если он был предоставлен
    let fileUrl = null
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fileUrl = await uploadFile(buffer, file.name)
    }

    // Создаем новый пост
    const newPost = await db.insert(feed).values({
      title,
      content,
      groupId,
      autor: userId,
      file: fileUrl,
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
