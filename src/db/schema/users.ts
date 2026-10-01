import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { memberships } from "./memberships";
import { posts } from "./posts";


export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', { length: 100 }).notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  passwordHash: varchar('password_hash', { length: 255 }).notNull(),

  createAt: timestamp('created_at').defaultNow().notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  post: many(posts)
}))