import { db } from "..";
import { users } from '../schema';
import { eq } from 'drizzle-orm';


export async function getUserByEmail(email: string) {
  
  const user = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    image: users.image
  })
  .from(users)
  .where(eq(users.email, email))
  .limit(1);
  
  return user[0] || null;
}

