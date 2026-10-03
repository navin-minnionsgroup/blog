import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

import { db } from "../../db";
import { users, tenants, memberships } from "../../db/schema";
import { eq } from "drizzle-orm";

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

export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user) {
    throw new Error("Invalid email or password.")
  }
  const passwordValid = await bcrypt.compare(password, user.passwordHash)

  if (!passwordValid) {
    throw new Error("Invalid email or password. ")
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d'
    }
  )
  return { user, token };
}