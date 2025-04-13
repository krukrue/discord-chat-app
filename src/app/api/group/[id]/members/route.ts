import { NextResponse } from "next/server";
import { db } from "@/server";
import { userSubscribe } from "@/server/schema";
import { eq } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const members = await db
      .select()
      .from(userSubscribe)
      .where(eq(userSubscribe.groupId, id));

    return NextResponse.json(members);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
