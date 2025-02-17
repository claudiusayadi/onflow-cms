import { IPost } from '../lib/types/models';
import Pagination from './pagination';
import Post from './post';

function Posts({
	posts,
	currentPage,
	totalPages,
}: {
	posts: IPost[];
	currentPage: number;
	totalPages: number;
}) {
	return (
		<div>
			<h2 className='font-bold text-gray-800 text-5xl leading-tight'>
				Latest Posts
			</h2>
			<ul className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
				{posts.map(post => (
					<Post key={post.id} post={post} />
				))}
			</ul>
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				className='mt-10'
			/>
		</div>
	);
}
export default Posts;
