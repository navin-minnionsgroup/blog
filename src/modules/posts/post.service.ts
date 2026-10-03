import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { posts } from "../../db/schema";

type CreatePostInput = {
  tenantId: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
};

export async function createPost(input: CreatePostInput) {
  const [post] = await db
    .insert(posts)
    .values({
      tenantId: input.tenantId,
      authorId: input.authorId,
      title: input.title,
      slug: input.slug,
      content: input.content,
      published: input.published,
    })
    .returning();

  return post;
}

export async function getPosts(tenantId: string) {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.tenantId, tenantId))
}
export async function getPostById(
  postId: string,
  tenantId: string
) {
  const [post] = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.id, postId),
        eq(posts.tenantId, tenantId)
      )
    )
    .limit(1);

  return post;
}

export async function updatePost(
  postId: string,
  tenantId: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    published?: boolean;
  }
) {
  const [post] = await db
    .update(posts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(posts.id, postId),
        eq(posts.tenantId, tenantId)
      )
    )
    .returning();

  return post;
}

export async function deletePost(
  postId: string,
  tenantId: string
) {
  const [post] = await db
    .delete(posts)
    .where(
      and(
        eq(posts.id, postId),
        eq(posts.tenantId, tenantId)
      )
    )
    .returning();

  return post;
}