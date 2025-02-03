import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  postId: uuid('post_id').notNull(),
  authorId: uuid('author_id').notNull(),
});
