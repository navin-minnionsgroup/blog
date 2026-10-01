import { db } from "../../db";
import { tenants } from "../../db/schema";

type CreateTenantInput = {
  name: string;
  slug: string
}

export async function createTenant(input: CreateTenantInput) {
  const [tenant] = await db.insert(tenants)
    .values({ name: input.name, slug: input.slug })
    .returning();
  return tenant
}