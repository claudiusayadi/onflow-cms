import { jwtVerify, SignJWT } from 'jose';
import { Session } from './types/session.d';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
	const session = await new SignJWT(payload)
		.setProtectedHeader({
			alg: 'HS256',
		})
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey);

	(await cookies()).set('session', session, {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		sameSite: 'lax',
		path: '/',
	});
}

export async function getSession() {
	const cookie = (await cookies()).get('session')?.value;

	if (!cookie) return null;

	try {
		const { payload } = await jwtVerify(cookie, encodedKey, {
			algorithms: ['HS256'],
		});

		return payload;
	} catch (error) {
		console.error('Failed to verify session: ', error);
		redirect('/auth/signin');
	}
}

export async function deleteSession() {
	(await cookies()).delete('session');
}
