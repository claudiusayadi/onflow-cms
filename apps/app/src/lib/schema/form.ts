import { z } from 'zod';
export const formSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }).trim(),
	password: z
		.string()
		.min(8, { message: 'be at least 8 characters long' })
		.regex(/[a-zA-Z]/, { message: 'contain at least one letter' })
		.regex(/[0-9]/, { message: 'contain at least one number' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'contain at least one special character',
		})
		.trim(),
});
