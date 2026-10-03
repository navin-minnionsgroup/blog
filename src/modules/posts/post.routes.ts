import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { tenantMiddleware } from "../../middleware/tenant";
import { createPostController, deletePostController, getPostsController, updatePostController } from "./post.controller";

const router = Router()

router.post('/', authMiddleware,
  tenantMiddleware,
  createPostController
)

router.get('/', authMiddleware,
  tenantMiddleware,
  getPostsController
)
router.get('/:id', authMiddleware, tenantMiddleware, getPostsController)

router.patch(
  "/:id",
  authMiddleware,
  tenantMiddleware,
  updatePostController
);
router.delete(
  "/:id",
  authMiddleware,
  tenantMiddleware,
  deletePostController
);
export default router
