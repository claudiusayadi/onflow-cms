import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../users/users.schema';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  writerId: uuid('writer_id')
    .notNull()
    .references(() => users.id),
});

// Each post has one writer (a user) - one-to-many.
export const postsRelations = relations(posts, ({ one }) => ({
  writer: one(users, {
    fields: [posts.writerId],
    references: [users.id],
  }),
}));
