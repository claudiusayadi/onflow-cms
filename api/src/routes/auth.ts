import { DatabaseError } from 'pg';
import { eq } from 'drizzle-orm';
import { hasher, verifier } from '@/lib/password';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { users } from '@/db/schema/users';
import { userSchema } from '@/types';
import { zValidator } from '@hono/zod-validator';
import db from '@/db';

const authRoutes = new Hono()
	.post('/signup', zValidator('json', userSchema), async c => {
		const { username, password } = await c.req.valid('json');

		try {
			await db.insert(users).values({
				id: nanoid(20),
				username,
				password: await hasher(password),
			});

			return c.json({
				success: true,
				message:
					'Sign up successful, please sign in with your username and password.',
			});
		} catch (error) {
			if (error instanceof DatabaseError && error.code === '23505')
				throw new HTTPException(409, {
					message: 'Username already used',
				});
			throw new HTTPException(500, { message: 'Failed to create user' });
		}
	})

	.post('/login', zValidator('json', userSchema), async c => {
		const { username, password } = c.req.valid('json');

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (!user || user.password !== verifier(user.password, password)) {
			throw new HTTPException(401, {
				message: 'Invalid credentials',
			});
		}
	})

	.get('/callback', async c => {
		const url = new URL(c.req.url);
		await kindeClient.handleRedirectToApp(sessionManager(c), url);
		return c.redirect('/');
	})
	.get('/logout', async c => {
		const url = await kindeClient.logout(sessionManager(c));
		return c.redirect(url.toString());
	})
	.get('/me', getUser, async c => {
		const user = c.var.user;
		return c.json({ user });
	});

export default authRoutes;
