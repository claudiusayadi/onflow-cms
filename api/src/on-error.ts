import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

const onError: ErrorHandler = async (err, c) => {
	if (err instanceof HTTPException) {
		return (
			err.res ??
			c.json(
				{
					success: false,
					error: err.message,
					status: err.status,
				},
				err.status
			)
		);
	}

	// For non-HTTPException errors
	return c.json(
		{
			success: false,
			error:
				process.env.NODE_ENV === 'production'
					? 'Internal Server Error'
					: err.message || 'Unknown error occurred',
			status: 500,
		},
		500
	);
};

export default onError;
