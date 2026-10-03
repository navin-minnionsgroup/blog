import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { tenantMiddleware } from "../../middleware/tenant";
import { createPostController, getPostsController } from "./post.controller";

const route = Router()

route.post('/', authMiddleware,
  tenantMiddleware,
  createPostController
)

route.get('/', authMiddleware,
  tenantMiddleware,
  getPostsController
)
export default route
