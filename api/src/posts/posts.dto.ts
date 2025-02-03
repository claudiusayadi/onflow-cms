import z from '../commons/zod';

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  writerId: z.string().uuid(),
});
export type CreatePostDto = z.infer<typeof createPostSchema>;
export const updatePostSchema = createPostSchema.partial();
export type UpdatePostDto = z.infer<typeof updatePostSchema>;
