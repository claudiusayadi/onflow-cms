import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId], 
    references: [posts.id], 
  }),
  tag: one(tags, {
    fields: [postTags.tagId], 
    references: [tags.id], 
  }),
}));