import { Request, Response } from "express";

import { registerSchema } from "./auth.schema";
import { registerUser } from "./auth.service";

export async function registerController(
  req: Request,
  res: Response
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error,
    });
  }

  const resultUser = await registerUser(result.data);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: resultUser.user.id,
      name: resultUser.user.name,
      email: resultUser.user.email,
    },
    tenant: resultUser.tenant,
    membership: resultUser.membership,
  });
}