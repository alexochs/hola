import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core"

export const dbChatScenes = pgTable("ChatScenes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  framing: text("framing").notNull(),
})

export const dbChats = pgTable("Chats", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  sceneId: integer("sceneId").notNull(),
})

export const dbChatLogs = pgTable("ChatLogs", {
  id: serial("id").primaryKey(),
  chatId: varchar("chatId").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
})
