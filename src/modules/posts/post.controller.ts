import { Request, Response } from "express";

import { createPostSchema, updatePostSchema } from "./post.schema";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "./post.service";

export async function createPostController(
  req: Request,
  res: Response
) {
  const result = createPostSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten(),
    });
  }

  if (!req.user || !req.tenantId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const post = await createPost({
    tenantId: req.tenantId,
    authorId: req.user.id,

    ...result.data,
  });

  return res.status(201).json({
    message: "Post created successfully",
    post,
  });
}

export async function getPostsController(
  req: Request,
  res: Response
) {
  if (!req.tenantId) {
    return res.status(401).json({
      message: "Tenant context required",
    });
  }

  const posts = await getPosts(req.tenantId);

  return res.json({
    posts,
  });
}

export async function getPostByIdController(
  req: Request,
  res: Response
) {
  if (!req.tenantId) {
    return res.status(401).json({
      message: "Tenant context required",
    });
  }

  const post = await getPostById(
    req.params.id,
    req.tenantId
  );

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.json({
    post,
  });
}

export async function updatePostController(
  req: Request,
  res: Response
) {
  const result = updatePostSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten(),
    });
  }

  if (!req.tenantId) {
    return res.status(401).json({
      message: "Tenant context required",
    });
  }

  const post = await updatePost(
    req.params.id,
    req.tenantId,
    result.data
  );

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.json({
    message: "Post updated successfully",
    post,
  });
}

export async function deletePostController(
  req: Request,
  res: Response
) {
  if (!req.tenantId) {
    return res.status(401).json({
      message: "Tenant context required",
    });
  }

  const post = await deletePost(
    req.params.id,
    req.tenantId
  );

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.json({
    message: "Post deleted successfully",
  });
}