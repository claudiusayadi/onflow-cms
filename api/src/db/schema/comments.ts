import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const comments = pgTable('comments', {
	id: varchar('id').primaryKey(),
	userId: varchar('user_id').references(() => users.id),
	content: text('content').notNull(),
	postId: varchar('post_id').notNull(),
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
