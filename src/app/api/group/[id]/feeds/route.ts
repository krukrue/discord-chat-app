import { NextResponse } from "next/server";
import { db } from "@/server";
import { feed } from "@/server/schema";
import { eq } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const posts = await db
      .select()
      .from(feed)
      .where(eq(feed.groupId, id))
      .orderBy(feed.createdAt);

    return NextResponse.json(posts);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
