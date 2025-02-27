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

		if (result.errors && !result.data) {
			console.log('GraphQL error: ', result.errors);
			const errorMessage =
				result.errors[0]?.message || 'Failed to fetch from API';
			throw new Error(errorMessage);
		}

		if (result.data) {
			if (result.errors) {
				console.warn('GraphQL returned partial errors: ', result.errors);
			}
			return result.data;
		}

		throw new Error('No data returned from API');
	} catch (error) {
		console.error('Fetcher error: ', error);
		throw error;
	}
};
