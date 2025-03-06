export async function fetcher(query: string, variables: Record<string, any>) {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables }),
	});
	const { data, errors } = await response.json();
	if (errors) throw new Error(JSON.stringify(errors));
	return data;
}
