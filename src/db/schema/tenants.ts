import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100, }).notNull(),

  slug: varchar("slug", { length: 100, }).notNull().unique(),

  createdAt: timestamp("created_at").defaultNow().notNull()
})