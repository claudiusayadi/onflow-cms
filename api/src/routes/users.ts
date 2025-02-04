import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import z from '../lib/z';
import { getUser } from '../kinde';
import { users, usersInsertSchema } from '../db/schema/users';
import { and, desc, eq } from 'drizzle-orm';
import db from '../db';
import { userSchema } from '@shared/types';

const userRoutes = new Hono()
	.get('/', async c => {
		const docs = await db
			.select()
			.from(users)
			.orderBy(desc(users.createdAt))
			.limit(10);
		return c.json({ docs }, 200);
	})

	.post('/', getUser, zValidator('json', userSchema), async c => {
		const doc = c.req.valid('json');
		const user = c.var.user;
		const validatedDoc = usersInsertSchema.parse({
			...doc,
			userId: user.id,
		});
		const docs = await db.insert(users).values(validatedDoc).returning();

		const newUser = docs[0];
		return c.json({ newUser }, 201);
	})

	.get(
		'/:id{[0-9]+}',
		zValidator('param', z.object({ id: z.coerce.number() })),
		async c => {
			const { id } = c.req.valid('param');
			const docs = await db
				.select()
				.from(users)
				.where(eq(users.id, id))
				.returning({
					id: users.id,
					email: users.email,
					role: users.role,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
				});

			if (!docs.length)
				return c.json({ error: `No user found with the ID ${id}` }, 404);

			const user = docs[0];
			return c.json({ user }, 200);
		}
	)

	.patch(
		'/:id{[0-9]+}',
		getUser,
		zValidator('param', z.object({ id: z.coerce.number() })),
		zValidator('json', userSchema),
		async c => {
			const user = c.var.user;
			const { id } = c.req.valid('param');
			const doc = c.req.valid('json');

			const validatedDoc = usersInsertSchema.parse({
				...doc,
				email: doc.email,
				role: doc.role,
			});

			const docs = await db
				.update(users)
				.set(validatedDoc)
				.where(and(eq(users.userId, user.id), eq(users.id, id)))
				.returning({
					id: users.id,
					email: users.email,
					role: users.role,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
				});

			if (!docs.length)
				return c.json({ error: `No user found with the ID ${id}` }, 404);

			const updatedUser = docs[0];
			return c.json({ updatedUser }, 200);
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
				.delete(users)
				.where(and(eq(users.userId, user.id), eq(users.id, id)))
				.returning({
					id: users.id,
					email: users.email,
					role: users.role,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
				});

			if (!docs.length)
				return c.json({ error: `No user found with the ID ${id}` }, 404);
			c.status(204);

			const deletedUser = docs[0];
			c.status(204);
			return c.json({ deletedUser });
		}
	);

export default userRoutes;
