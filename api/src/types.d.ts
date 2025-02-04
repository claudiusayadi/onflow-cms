import { ApiTypes } from '../api/src/app';
import type { commentsInsertSchema } from './db/schema/comments';
import type { postsInsertSchema } from './db/schema/posts';
import type { tagsInsertSchema } from './db/schema/tags';
import type { usersInsertSchema, profileInsertSchema } from './db/schema/users';

export { ApiTypes };

export const userSchema = usersInsertSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
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
