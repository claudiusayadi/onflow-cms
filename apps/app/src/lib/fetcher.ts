import { GRAPHQL_URL } from './constants';

export const fetcher = async (query: string, variables = {}) => {
	try {
		const res = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query, variables }),
		});

		const result = await res.json();

		if (result.errors) {
			console.log('GraphQL error: ', result.errors);
			throw new Error('Failed to fetch from API');
		}
		return result.data;
	} catch (error) {
		console.log('GraphQL error: ', error);
		throw new Error('Fetcher error');
	}
};
