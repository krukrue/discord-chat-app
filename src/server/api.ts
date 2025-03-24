import { db } from 'server/index';
import { eq } from 'drizzle-orm';
import { users } from "server/schema";

export async function getUser(id: string) {
    const currentUser = false; // TODO: Figure out how to check this
    var result;
    // The user should not be able to get other users' emails
    if (currentUser) {
        result = await db.select({
            id: users.id,
            name: users.name,
            image: users.image})
            .from(users)
            .where(eq(users.id, id));
    } else {
        result = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image})
            .from(users)
            .where(eq(users.id, id));
    }
    return result[0];
}