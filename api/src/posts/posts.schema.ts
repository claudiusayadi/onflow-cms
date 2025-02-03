import {
  pgTable,
  uuid,
  varchar,
  text
} from 'drizzle-orm/pg-core';
import {
  relations
} from 'drizzle-orm';
import {
  users
} from '../users/users.schema';
import {
  comments
} from '../comments/comments.schema';
import {
  tags,
  postTags
} from '../tags/tags.schema';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', {
    length: 255
  }).notNull(),
  content: text('content').notNull(),
  writerId: uuid('writer_id')
  .notNull()
  .references(() => users.id),
});

// A post has only one author but many comments and tags
export const postsRelations = relations(posts, ({
  one, many
}) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  tags: many(postTags),
}));

export const postTags = pgTable(
  'post_tags',
  postId: uuid('post_id')
  .notNull()
  .references(() => posts.id, {
    onDelete: 'cascade'
  }),
  tagId: uuid('tag_id')
  .notNull()
  .references(() => tags.id, {
    onDelete: 'cascade'
  }),
},
(t) => [idx: [t.postId, t.tagId]
]
);

export const postTagsRelations = relations(postTags, ({
one
}) => ({
post: one(posts, {
fields: [postTags.postId],
references: [posts.id],
}),
tag: one(tags, {
fields: [postTags.tagId],
references: [tags.id],
}),
}));