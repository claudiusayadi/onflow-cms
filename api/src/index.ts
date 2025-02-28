import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { showRoutes } from 'hono/dev';
import { env } from './config';
import { HTTPException } from 'hono/http-exception';
import onError from './on-error';
import authRoutes from './routes/auth';

const app = new Hono();
app.use(logger());
app.use(
	'*',
	cors({
		origin: '*', // TODO: Change this to onflow-cms.dovely.tech in production
		credentials: true,
	})
);

app.basePath('/api/v1').route('/auth', authRoutes);

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
