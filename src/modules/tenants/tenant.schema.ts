import z from "zod";

export const createTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tenant name is required")
    .max(100, "Tenant name must be at most 100 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "slug is required")
    .max(100, "Tenant name must be at most 100 character")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    )
})