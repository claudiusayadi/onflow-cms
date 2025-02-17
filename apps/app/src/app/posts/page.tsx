import Posts from '../../components/posts';
import { getPosts } from '../../lib/actions/posts';
import { DEFAULT_PAGE_SIZE } from '../../lib/constants';

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function PostsPage({ searchParams }: Props) {
	const { page } = await searchParams;
	console.log(page);
	const { totalPosts, posts } = await getPosts({
		page: page ? +page : undefined,
	});
	return (
		<section className='mx-auto px-4 py-8 container'>
			<Posts
				posts={posts}
				currentPage={page ? +page : 1}
				totalPages={totalPosts / DEFAULT_PAGE_SIZE}
			/>
		</section>
	);
}
export default PostsPage;
