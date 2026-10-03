import { Request, Response } from "express";

import { loginSchema, registerSchema } from "./auth.schema";
import { loginUser, registerUser } from "./auth.service";

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

export async function loginController(
  req: Request,
  res: Response
) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten(),
    });
  }

  try {
    const resultUser = await loginUser(
      result.data.email,
      result.data.password
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: resultUser.user.id,
        name: resultUser.user.name,
        email: resultUser.user.email,
      },
      token: resultUser.token,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
}