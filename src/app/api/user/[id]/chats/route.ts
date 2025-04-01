import { getUserChats } from "@/server/actions/get-chats";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    
    const userId = pathParts[3];
    
    console.log("URL path:", url.pathname);
    console.log("Path parts:", pathParts);
    console.log("Extracted userId:", userId);
    
    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }
    
    const chats = await getUserChats(userId);
    return NextResponse.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}


