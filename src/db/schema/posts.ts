import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),

  tenantId: uuid("tenant_id").notNull(),

  authorId: uuid("author_id").notNull(),

  title: varchar("title", {
    length: 200,
  }).notNull(),

  slug: varchar("slug", {
    length: 200,
  }).notNull(),

  content: text("content").notNull(),

  published: boolean("published")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});