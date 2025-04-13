import { NextResponse } from "next/server";
import { db } from "@/server";
import { group } from "@/server/schema";
import { eq } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const groupData = await db
      .select()
      .from(group)
      .where(eq(group.id, id))
      .limit(1)
      .then((res) => res[0]);

    if (!groupData) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(groupData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch group data" }, { status: 500 });
  }
}
