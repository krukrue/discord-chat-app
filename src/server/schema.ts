import { InferSelectModel } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
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
});
 
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
);

export const chats = pgTable("chat", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user1Id: text("user1Id").references(() => users.id, { onDelete: "cascade" }),
  lastMessage: text("lastMessage"),
  lastMessageAt: timestamp("lastMessageAt", { mode: "date" }).defaultNow(),
  isGroup: boolean("isGroup").notNull().default(false),
});

export const chatUsers = pgTable(
  "chat_users",
  {
    chatId: text("chatId")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    avatar: text("avatar"),
    addedAt: timestamp("addedAt", { mode: "date" }).defaultNow(),
    role: text("role").default("member"),
  },
  (chatUserEntry) => [
    {
      compoundKey: primaryKey({
        columns: [chatUserEntry.chatId, chatUserEntry.userId],
      }),
    },
  ]
);

export const messages = pgTable("message", { 
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: text("chatId").references(() => chats.id, { onDelete: "cascade" }),
  senderId: text("senderId").references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  file: text("file"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type Chat = InferSelectModel<typeof chats>;
export type ChatUser = InferSelectModel<typeof chatUsers>;
export type Message = InferSelectModel<typeof messages>;
