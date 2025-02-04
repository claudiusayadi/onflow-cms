import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { posts } from './posts';
import { comments } from './comments';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').notNull().default('reader'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// A user can have just one profile (one-to-one) but can write many posts/comments - one-to-many
export const usersRelations = relations(users, ({ one, many }) => ({
	profile: one(profile, {
		fields: [users.id],
		references: [profile.userId],
	}),
	posts: many(posts),
	comments: many(comments),
}));

// Additional user details -  (one-to-one with users)
export const profile = pgTable('profile', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
	username: text('username').notNull().unique(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	about: text('about'),
});

export const profileRelations = relations(profile, ({ one }) => ({
	user: one(users, {
		fields: [profile.userId],
		references: [users.id],
	}),
}));

export const usersInsertSchema = createInsertSchema(users);
export const usersSelectSchema = createSelectSchema(users);

export const profileInsertSchema = createInsertSchema(profile);
export const profileSelectSchema = createSelectSchema(profile);
