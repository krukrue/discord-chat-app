import { getUserById } from "@/server/actions/get-user";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  return NextResponse.json(user);
}
