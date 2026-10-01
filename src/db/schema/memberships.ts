import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tenants } from "./tenants";
import { One, relations } from "drizzle-orm";

export const memberships = pgTable('memberships', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid("user_id").notNull().references(() => users.id),

  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),

  role: varchar("role", { length: 20 }).notNull(),

  createAt: timestamp('created_at').defaultNow().notNull(),

})

export const membershipsRelations = relations(
  memberships,
  ({ one }) => ({
    user: one(users, {
      fields: [memberships.userId],
      references: [users.id],
    }),

    tenants: one(tenants, {
      fields: [memberships.tenantId],
      references: [tenants.id]
    })
  })
)