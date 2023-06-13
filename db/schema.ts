import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core"

export const dbChatLogs = pgTable("ChatLogs", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
})
