import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"
 
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

/*export const chats = pgTable("chat", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user1Id: text("user1Id").references(() => users.id, { onDelete: "cascade" }),
  user2Id: text("user2Id").references(() => users.id, { onDelete: "cascade" }),
  user1Avatar: text("user1Avatar"), // Why store avatars but not usernames? Customisable avatars per chat?
  user2Avatar: text("user2Avatar"),
  lastMessage: text("lastMessage"),
  lastMessageAt: timestamp("lastMessageAt", { mode: "date" }).defaultNow(),
});

export const messages = pgTable("message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: text("chatId").references(() => chats.id, { onDelete: "cascade" }),
  senderId: text("senderId").references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  image: text("image"), // hmm
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});*/

// Drizzle table relation setup

// TODO: This