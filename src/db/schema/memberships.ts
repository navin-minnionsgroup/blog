import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tenants } from "./tenants";

export const memberships = pgTable('memberships', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid("user_id").notNull().references(() => users.id),

  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),

  role: varchar("role", { length: 20 }).notNull(),

  createAt: timestamp('created_at').defaultNow().notNull(),

})