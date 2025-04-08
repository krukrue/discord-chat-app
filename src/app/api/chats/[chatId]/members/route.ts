import { db } from "@/server";
import { chatMembers, users } from "@/server/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET: Получение участников группы
export async function GET(
    req: Request,
    context: { params: { chatId: string } }
) {
    const { chatId } = context.params;
    if (!chatId) return NextResponse.json({ error: "Chat ID required" }, { status: 400 });

    const members = await db
        .select({
            id: users.id,
            nickname: users.name,
            avatarUrl: users.image,
        })
        .from(users)
        .innerJoin(chatMembers, eq(users.id, chatMembers.userId))
        .where(eq(chatMembers.chatId, chatId));

    return NextResponse.json(members);
}

// POST: Добавление участника по email
export async function POST(
    req: Request,
    context: { params: { chatId: string } }
) {
    const { chatId } = context.params;
    const { email } = await req.json();

    if (!chatId || !email) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await db.insert(chatMembers).values({ chatId, userId: user.id });

    return NextResponse.json({
        id: user.id,
        nickname: user.name,
        avatarUrl: user.image,
    });
}

// DELETE: Удаление участника по userId
export async function DELETE(
    req: NextRequest,
    context: { params: { chatId: string } }
) {
    const { chatId } = context.params;
    const { userId } = await req.json();

    if (!chatId || !userId) {
        return NextResponse.json({ error: "Missing chatId or userId" }, { status: 400 });
    }

    await db
        .delete(chatMembers)
        .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, userId)));

    return NextResponse.json({ success: true });
}
