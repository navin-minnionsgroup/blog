import { Request, Response } from "express";

import { createTenantSchema } from "./tenant.schema";
import { createTenant } from "./tenant.service";

export async function createTenantController(
  req: Request,
  res: Response
) {
  const result = createTenantSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten(),
    });
  }

  const tenant = await createTenant(result.data);

  return res.status(201).json({
    message: "Tenant created successfully",
    tenant,
  });
}