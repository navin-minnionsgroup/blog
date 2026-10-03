import { email, z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),

  tenantName: z
    .string()
    .trim()
    .min(1, "Tenant name is required")
    .max(100, "Tenant name must be at most 100 characters"),

  tenantSlug: z
    .string()
    .trim()
    .min(1, "Tenant slug is required")
    .max(100, "Tenant slug must be at most 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Tenant slug can only contain lowercase letters, numbers and hyphens"
    ),
});

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address. "),

  password: z.string().min(1, "password is required.")
})