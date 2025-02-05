import { env } from '@/config';
import { Context } from 'hono';
import { setSignedCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';

const DURATIONS = {
	access: 300, // 5 minutes
	refresh: 604800, // 7 days
} as const;

const createCookieOptions = (duration: number) =>
	({
		path: '/api/v1',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 1000,
		expiresIn: duration,
		sameSite: 'lax',
	} as const);

export const sendTokens = async (c: Context, userId: string) => {
	const now = Math.floor(Date.now() / 1000);

	const createToken = async (duration: number, secret: string) => {
		const payload = {
			userId,
			origin: '/auth/login',
			exp: now + duration,
		};
		return sign(payload, secret);
	};

	const [accessToken, refreshToken] = await Promise.all([
		createToken(DURATIONS.access, env.ACCESS_TOKEN_SECRET),
		createToken(DURATIONS.refresh, env.REFRESH_TOKEN_SECRET),
	]);

	await Promise.all([
		setSignedCookie(
			c,
			'access_token',
			accessToken,
			env.COOKIE_SECRET,
			createCookieOptions(DURATIONS.access)
		),
		setSignedCookie(
			c,
			'refresh_token',
			refreshToken,
			env.COOKIE_SECRET,
			createCookieOptions(DURATIONS.refresh)
		),
	]);
};
