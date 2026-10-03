import { Router } from "express";

import {
  getUploadAuthController,
} from "./media.controller";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get(
  "/upload-auth",
  authMiddleware,
  getUploadAuthController
);

export default router;