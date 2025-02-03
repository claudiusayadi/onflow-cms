import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema'
import { posts } from '../posts/posts.schema'

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  postId: uuid('post_id').notNull(),
  authorId: uuid('author_id').notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId], 
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId], 
    references: [posts.id],
  }),
}));