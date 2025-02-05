import { commentsInsertSchema } from '@/db/schema/comments';
import { postsInsertSchema } from '@/db/schema/posts';
import { tagsInsertSchema } from '@/db/schema/tags';
import { usersInsertSchema, profileInsertSchema } from '@/db/schema/users';
import z from '@/lib/z';

export const userSchema = usersInsertSchema
	.pick({
		username: true,
		password: true,
		role: true,
	})
	.extend({
		username: z
			.string()
			.min(3, { message: 'Username must be at least 3 characters' })
			.regex(/^[a-zA-Z0-9_]+$/, {
				message: 'Username can only contain letters, numbers and underscore',
			}),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
				message: 'Password must contain uppercase, lowercase, and number',
			}),
		role: z.enum(['reader', 'writer', 'editor', 'admin']),
	});

export const profileSchema = profileInsertSchema.omit({
	id: true,
	userId: true,
});

export const postSchema = postsInsertSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const commentSchema = commentsInsertSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const tagSchema = tagsInsertSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
