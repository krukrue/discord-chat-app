import { db } from "@/server"
import { auth } from "@/server/auth"
import { group } from "@/server/schema"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const { name, private: isPrivate } = await req.json()

  await db.insert(group).values({
    name,
    private: isPrivate,
    creatorId: userId,
  }) 

  return NextResponse.json({ success: true })
}
