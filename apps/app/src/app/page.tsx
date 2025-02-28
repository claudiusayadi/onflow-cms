import { getSession } from '@/lib/session';

export default async function Home() {
	const session = await getSession();
	console.log('user session: ', session);
	return <div>Hello</div>;
}
