import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { comments } from './comments';
import { postsToTags } from './tags';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const posts = pgTable(
	'posts',
	{
		id: uuid('id').primaryKey(),
		userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		content: text('content').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	t => [index('user_id_idx').on(t.userId)]
);

// A post has only one author but many comments and tags
export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.userId],
		references: [users.id],
	}),
	comments: many(comments),
	postsToTags: many(postsToTags),
}));

export const postsInsertSchema = createInsertSchema(posts);
export const postsSelectSchema = createSelectSchema(posts);
