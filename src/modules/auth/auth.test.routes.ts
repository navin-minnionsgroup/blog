import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { tenantMiddleware } from "../../middleware/tenant";


const router = Router();

router.get("/me", authMiddleware, tenantMiddleware, (req, res) => {
  return res.json({
    message: "You are authenticated",
    userId: req.user?.id,
    tenantId: req.tenantId,
    role: req.tenantRole,
  });
});

export default router;