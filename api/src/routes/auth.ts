import { DatabaseError } from 'pg';
import { eq } from 'drizzle-orm';
import { hasher, verifier } from '@/lib/password';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { users } from '@/db/schema/users';
import { userSchema } from '@shared/types';
import { zValidator } from '@hono/zod-validator';
import db from '@/db';
import { sendTokens } from '@/lib/jwt';
import { deleteCookie, getSignedCookie } from 'hono/cookie';
import { env } from '@/config';
import { verify } from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';

interface MyJWTPayload extends JWTPayload {
	userId: string;
}

const authRoutes = new Hono()
	.post('/signup', zValidator('json', userSchema), async c => {
		const { username, password } = c.req.valid('json');

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

		if (!user || !(await verifier(user.password, password)))
			throw new HTTPException(401, {
				message: 'Invalid credentials',
			});

		await sendTokens(c, user.id);

		return c.json(
			{
				success: true,
				message: 'Login successful',
			},
			200
		);
	})

	.post('/verify', async c => {
		try {
			const cookies = await getSignedCookie(c, env.COOKIE_SECRET);
			const access_token = cookies.access_token;
			const refresh_token = cookies.refresh_token;

			if (!access_token || !refresh_token)
				throw new HTTPException(401, {
					message: 'Unauthorized! Please login to continue.',
				});

			const payload = (await verify(
				access_token,
				env.ACCESS_TOKEN_SECRET
			)) as MyJWTPayload;

			return c.json({ userId: payload.userId });
		} catch (error) {
			throw new HTTPException(401, {
				message: 'Invalid token',
			});
		}
	})

	.post('/logout', async c => {
		deleteCookie(c, 'access_token', { path: '/api/v1' });
		deleteCookie(c, 'refresh_token', { path: '/api/v1' });
		return c.json({
			success: true,
			message: 'Logout successful',
		});
	});

export default authRoutes;
