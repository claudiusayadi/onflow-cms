import Posts from '../../components/posts';
import { getPosts } from '../../lib/actions/posts';

async function PostsPage() {
	const posts = await getPosts();
	return (
		<section>
			<Posts posts={posts} />
		</section>
	);
}
export default PostsPage;
