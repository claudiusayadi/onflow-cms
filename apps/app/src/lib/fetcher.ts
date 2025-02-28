import { GRAPHQL_URL } from './constants';

export const fetcher = async (query: string, variables = {}) => {
	try {
		const res = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, variables }),
		});

		const { data, errors } = await res.json();

		if (errors) {
			console.error('Fetcher errors:', errors);
			const errorMessage = errors.map(e => e.message).join(', ');
			throw new Error(errorMessage);
		}

		return data;
	} catch (error) {
		console.error('Fetcher error:', error);
		throw error;
	}
};
