import { ApiTypes } from '../api/src/app';
import type { commentsInsertSchema } from '../api/src/db/schema/comments';
import type { postsInsertSchema } from '../api/src/db/schema/posts';
import type { tagsInsertSchema } from '../api/src/db/schema/tags';
import type {
	usersInsertSchema,
	profileInsertSchema,
} from '../api/src/db/schema/users';

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
