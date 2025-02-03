import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { posts } from '../posts/posts.schema';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('reader'),
});

// Additional user details -  (one-to-one relations with users)
export const profile = pgTable('profile', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  username: varchar('username', { length: 100 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  about: text('about'),
});

// A user can have many posts (i.e. be the writer for many posts) - one-to-many.
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
