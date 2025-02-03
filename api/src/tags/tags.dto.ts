import z from '../commons/zod';

export const createTagSchema = z.object({
  name: z.string().min(1),
});

export type CreateTagDto = z.infer<typeof createTagSchema>;
export const updateTagSchema = createTagSchema.partial();
export type UpdateTagDto = z.infer<typeof updateTagSchema>;
