import { eq } from "drizzle-orm";
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