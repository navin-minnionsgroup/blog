import { Router } from "express";

import { createTenantController } from "./tenant.controller";

const router = Router();

router.post("/", createTenantController);

export default router;