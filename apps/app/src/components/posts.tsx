import { IPost } from '../lib/types/models';
import Post from './post';

function Posts({ posts }: { posts: IPost[] }) {
	return (
		<div className='mx-auto px-4 py-8 container'>
			<h2 className='font-bold text-gray-800 text-5xl leading-tight'>
				Latest Posts
			</h2>
			<ul className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr'>
				{posts.map(post => (
					<Post key={post.id} post={post} />
				))}
			</ul>
		</div>
	);
}
export default Posts;
