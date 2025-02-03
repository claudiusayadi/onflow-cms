import z from '../commons/zod';

export const createCommentSchema = z.object({
  content: z.string().min(1),
  postId: z.string().uuid(),
  authorId: z.string().uuid(),
});
export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export const updateCommentSchema = createCommentSchema.partial();
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
