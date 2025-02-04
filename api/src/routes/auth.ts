import { getUser, kindeClient, sessionManager } from '../kinde';
import { Hono } from 'hono';

const authRoutes = new Hono()
	.get('/login', async c => {
		const url = await kindeClient.login(sessionManager(c));
		return c.redirect(url.toString());
	})
	.get('/signup', async c => {
		const url = await kindeClient.register(sessionManager(c));
		return c.redirect(url.toString());
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
