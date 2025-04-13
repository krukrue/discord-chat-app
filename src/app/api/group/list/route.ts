// app/api/group/list/route.ts

import { db } from "@/server"
import { group } from "@/server/schema"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const groups = await db.select().from(group)

    return NextResponse.json(groups)
  } catch (err) {
    console.error("Failed to fetch groups:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
