import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { memberships } from "../db/schema";

export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [membership] = await db
    .select({
      tenantId: memberships.tenantId,
      role: memberships.role,
    })
    .from(memberships)
    .where(eq(memberships.userId, req.user.id))
    .limit(1);

  if (!membership) {
    return res.status(403).json({
      message: "You are not a member of any tenant",
    });
  }
  req.tenantId = membership.tenantId;
  req.tenantRole = membership.role;

  next();
}