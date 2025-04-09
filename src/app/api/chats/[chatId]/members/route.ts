import { db } from "@/server";
import { chatMembers, users } from "@/server/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// ---------- GET: Получение участников группы ----------
export async function GET(
    req: Request,
    context: { params: { chatId: string } }
) {
    const { chatId } = context.params;

    if (!chatId) {
        return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    // Выбираем участников
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

// ---------- POST: Добавление участника по email ----------
export async function POST(
    req: Request,
    context: { params: { chatId: string } }
) {
    const { chatId } = context.params;
    const body = await req.json();
    const { email } = body;

    if (!chatId || !email) {
        return NextResponse.json(
            { error: "Missing chatId or email" },
            { status: 400 }
        );
    }

    // 1) Проверяем есть ли такой пользователь
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2) Проверяем, что он НЕ состоит в чате (иначе дубликат)
    const [existing] = await db
        .select()
        .from(chatMembers)
        .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, user.id)))
        .limit(1);

    if (existing) {
        return NextResponse.json({ error: "User already in chat" }, { status: 409 });
    }

    // 3) Добавляем запись в chatMembers
    await db.insert(chatMembers).values({ chatId, userId: user.id });

    // 4) Возвращаем JSON с информацией, чтобы фронт обновил UI
    return NextResponse.json({
        id: user.id,
        nickname: user.name,
        avatarUrl: user.image,
    });
}

// ---------- DELETE: Удаление участника по userId ----------
export async function DELETE(
    req: NextRequest,
    context: { params: { chatId: string } }
) {
    const { chatId } = context.params;
    const body = await req.json();
    const { userId } = body;

    if (!chatId || !userId) {
        return NextResponse.json(
            { error: "Missing chatId or userId" },
            { status: 400 }
        );
    }

    // Удаляем запись из chat_members
    await db
        .delete(chatMembers)
        .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, userId)));

    return NextResponse.json({ success: true });
}
