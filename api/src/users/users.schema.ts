import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { posts } from '../posts/posts.schema';
import { tags } from '../tags/tags.schema';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('reader'),
});

// Additional user details -  (one-to-one with users)
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

// A user can have just one profile but can write many posts/comments - one-to-many

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profile, {
    fields: [users.id],  
    references: [profile.userId],  
  }),
  posts: many(posts), 
  comments: many(comments),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(users, {
    fields: [profile.userId],  
    references: [users.id],  
  }),
})); 