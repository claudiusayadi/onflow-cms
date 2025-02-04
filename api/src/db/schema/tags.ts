import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const tags = pgTable('tags', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
	postsToTags: many(postsToTags),
}));

export const postsToTags = pgTable(
	'posts_to_tags',
	{
		postId: uuid('post_id').references(() => posts.id),
		tagId: uuid('tag_id').references(() => tags.id),
	},
	t => [primaryKey({ columns: [t.postId, t.tagId] })]
);

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
	post: one(posts, {
		fields: [postsToTags.postId],
		references: [posts.id],
	}),
	tag: one(tags, {
		fields: [postsToTags.tagId],
		references: [tags.id],
	}),
}));

export const tagsInsertSchema = createInsertSchema(tags);
export const tagsSelectSchema = createSelectSchema(tags);
