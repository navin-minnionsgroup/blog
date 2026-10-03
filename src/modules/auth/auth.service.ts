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
  const passwordHash = await bcrypt.hash(input.password, 12);

  return await db.transaction(async (tx) => {
    // 1. Create user
    const [user] = await tx
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash,
      })
      .returning();

    // 2. Create tenant
    const [tenant] = await tx
      .insert(tenants)
      .values({
        name: input.tenantName,
        slug: input.tenantSlug,
      })
      .returning();

    // 3. Create membership
    const [membership] = await tx
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
  });
}