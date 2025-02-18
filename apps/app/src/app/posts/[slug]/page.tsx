import { getPostBySlug } from '@/lib/actions/posts';
import PostSingle from '../_components/single';

type Props = {
	params: {
		slug: string;
	};
};

async function PostPage({ params }: Props) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	return (
		<main className='mx-auto mt-16 px-4 py-8 container'>
			<PostSingle post={post} />
		</main>
	);
}

export default PostPage;
