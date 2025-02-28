import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import z from '../lib/z';
import { getUser } from '../kinde';
import { posts, postsInsertSchema } from '../db/schema/posts';
import { and, desc, eq } from 'drizzle-orm';
import db from '../db';
import { postSchema } from '@shared/types';

const postRoutes = new Hono()
	.get('/', async c => {
		const docs = await db
			.select()
			.from(posts)
			.orderBy(desc(posts.createdAt))
			.limit(10);
		return c.json({ docs }, 200);
	})

	.post('/', getUser, zValidator('json', postSchema), async c => {
		const post = c.req.valid('json');
		const user = c.var.user;
		const validatedDoc = postsInsertSchema.parse({
			...post,
			userId: user.id,
		});
		const docs = await db.insert(posts).values(validatedDoc).returning();

		const newPost = docs[0];
		return c.json({ newPost }, 201);
	})

	.get(
		'/:id{[0-9]+}',
		zValidator('param', z.object({ id: z.coerce.number() })),
		async c => {
			const { id } = c.req.valid('param');
			const docs = await db
				.select()
				.from(posts)
				.where(eq(posts.id, id))
				.orderBy(desc(posts.createdAt));

			if (!docs.length)
				return c.json({ error: `No Post found with the ID ${id}` }, 404);

			const post = docs[0];
			return c.json({ post }, 200);
		}
	)

	.patch(
		'/:id{[0-9]+}',
		getUser,
		zValidator('param', z.object({ id: z.coerce.number() })),
		zValidator('json', postSchema),
		async c => {
			const user = c.var.user;
			const { id } = c.req.valid('param');
			const post = c.req.valid('json');

			const validatedDoc = postsInsertSchema.parse({
				...post,
				title: post.title,
				content: post.content,
			});
			const docs = await db
				.update(posts)
				.set(validatedDoc)
				.where(and(eq(posts.userId, user.id), eq(posts.id, id)))
				.returning();

			if (!docs.length)
				return c.json({ error: `No Post found with the ID ${id}` }, 404);

			const updatedPost = docs[0];
			return c.json({ updatedPost }, 200);
		}
	)

	.delete(
		'/:id{[0-9]+}',
		getUser,
		zValidator('param', z.object({ id: z.coerce.number() })),
		async c => {
			const { id } = c.req.valid('param');
			const user = c.var.user;

			const docs = await db
				.delete(posts)
				.where(and(eq(posts.userId, user.id), eq(posts.id, id)))
				.returning();

			if (!docs.length)
				return c.json({ error: `No Post found with the ID ${id}` }, 404);
			c.status(204);

			const deletedPost = docs[0];
			c.status(204);
			return c.json({ deletedPost });
		}
	);

export default postRoutes;
