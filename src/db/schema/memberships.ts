import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const memberships = pgTable('memberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  tenantId: uuid("tenant_id").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  createAt: timestamp('created_at').defaultNow().notNull(),
})