import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { showRoutes } from 'hono/dev';
import { sign, verify } from 'hono/jwt';
import { env } from './config';
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import onError from './on-error';
import handler from './has-async';

const app = new Hono();

app.use(logger());
app.use(
	'*',
	cors({
		origin: '*', // TODO: Change this to onflow-cms.dovely.tech
		credentials: true,
	})
);

const cookieOptions = (duration: number) => ({
	path: '/api/v1',
	secure: process.env.NODE_ENV === 'production',
	httpOnly: true,
	maxAge: 1000,
	expiresIn: duration,
	sameSite: 'Lax' as const,
});

app
	.basePath('/api/v1')
	.post(
		'/auth/login',
		handler(async c => {
			const { username, password } = await c.req.json();

			if (!username || !password) {
				throw new HTTPException(400, {
					message: 'Username and password are required',
				});
			}

			// TODO: Validate that user.username exists and password matches user.password (hashed) in the database

			const tokenPayload = (expires: number) => ({
				username,
				origin: '/auth/login',
				exp: Math.floor(Date.now() / 1000) + expires,
			});

			const durations = {
				access: 300, // 5 minutes in seconds
				refresh: 604800, // 7 days in seconds
			};

			const payload = {
				access: tokenPayload(durations.access),
				refresh: tokenPayload(durations.refresh),
			};

			const accessToken = await sign(payload.access, env.ACCESS_TOKEN_SECRET);
			const refreshToken = await sign(
				payload.refresh,
				env.REFRESH_TOKEN_SECRET
			);

			await setSignedCookie(
				c,
				'access_token',
				accessToken,
				env.COOKIE_SECRET,
				cookieOptions(durations.access)
			);

			await setSignedCookie(
				c,
				'refresh_token',
				refreshToken,
				env.COOKIE_SECRET,
				cookieOptions(durations.refresh)
			);

			return c.json({
				success: true,
				message: 'Login successful',
			});
		})
	)

	.post(
		'/auth/verify',
		handler(async c => {
			const { access_token } = await getSignedCookie(c, env.COOKIE_SECRET);

			if (!access_token) {
				throw new HTTPException(401, {
					message: 'No access token provided',
				});
			}

			const payload = await verify(access_token, env.ACCESS_TOKEN_SECRET);
			return c.json({
				success: true,
				payload,
			});
		})
	)

	.post(
		'/auth/logout',
		handler(async c => {
			await deleteCookie(c, 'access_token', { path: '/api/v1' });
			await deleteCookie(c, 'refresh_token', { path: '/api/v1' });
			return c.json({
				success: true,
				message: 'Logout successful',
			});
		})
	);

// Global error handler
app.notFound(c => {
	throw new HTTPException(404, {
		message: `Resource not found`,
	});
});

app.onError(onError);

const startServer = async () => {
	try {
		const port = env.PORT;
		serve({
			port,
			fetch: app.fetch,
		});

		console.log(`Server is running on port ${port}`);
		console.log(`NODE_ENV: ${env.NODE_ENV}`);

		if (process.env.NODE_ENV === 'development') {
			console.log('Running in development mode!!!');
			showRoutes(app);
		}
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer();
