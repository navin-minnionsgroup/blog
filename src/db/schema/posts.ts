import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),

  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),

  authorId: uuid("author_id").notNull().references(() => users.id),

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

export const postRelations = relations(posts, ({ one }) => ({
  tenants: one(tenants, {
    fields: [posts.tenantId],
    references: [tenants.id]
  }),

  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}))