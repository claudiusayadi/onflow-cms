import z from '../commons/zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['reader', 'author', 'editor', 'admin']).default('reader'),
  profile: z.object({
    username: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    about: z.string().optional().nullable(),
  }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export const updateUserSchema = createUserSchema.partial();
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
