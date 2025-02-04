import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';
import { posts } from '../posts/posts.schema';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const comments = pgTable('comments', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	content: text('content').notNull(),
	postId: uuid('post_id').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	commenter: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
}));

export const commentsInsertSchema = createInsertSchema(comments);
export const commentsSelectSchema = createSelectSchema(comments);
