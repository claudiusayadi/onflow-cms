// import { Context, Next } from 'hono';
// import { HTTPException } from 'hono/http-exception';

// const handler = (fn: (c: Context, next: Next) => Promise<Response>) => {
// 	return async (c: Context, next: Next) => {
// 		try {
// 			return await fn(c, next);
// 		} catch (error: any) {
// 			throw new HTTPException(error?.status || 500, {
// 				message: error?.message || 'Internal Server Error',
// 			});
// 		}
// 	};
// };

// export default handler;
