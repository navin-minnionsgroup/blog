import bcrypt from "bcrypt";

import { db } from "../../db";
import { users, tenants, memberships } from "../../db/schema";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  tenantName: string;
  tenantSlug: string;
};

export async function registerUser(input: RegisterInput) {
  // 1. Hash the password
  const passwordHash = await bcrypt.hash(input.password, 12);

  // 2. Create the user
  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
    })
    .returning();

  // 3. Create the tenant
  const [tenant] = await db
    .insert(tenants)
    .values({
      name: input.tenantName,
      slug: input.tenantSlug,
    })
    .returning();

  // 4. Connect user to tenant as owner
  const [membership] = await db
    .insert(memberships)
    .values({
      userId: user.id,
      tenantId: tenant.id,
      role: "owner",
    })
    .returning();

  return {
    user,
    tenant,
    membership,
  };
}