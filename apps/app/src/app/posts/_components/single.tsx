import { IPost } from '../../../lib/types/models';
import { Card, CardBody, CardHead } from '../../../components/card';
import Image from 'next/image';
import SanitizedContent from './sanitized-content';

type Props = {
	post: IPost;
};

function PostSingle({ post }: Props) {
	return (
		<>
			<Card className='h-full'>
				<header className='p-4'>
					<h1 className='mb-4 font-bold text-slate-700 text-4xl'>
						{post.title}
					</h1>
					<p className='mb-4 text-slate-500'>
						By {post.author.name} |{' '}
						{new Date(post.createdAt).toLocaleDateString()}
					</p>
					<CardHead className='w-80 h-60'>
						<picture>
							<source
								srcSet={post.thumbnail ?? '/no-image.jpg'}
								type='image/webp'
							/>
							<source
								srcSet={post.thumbnail ?? '/no-image.jpg'}
								type='image/jpeg'
							/>
							<Image
								src={post.thumbnail ?? '/no-image.jpg'}
								alt={post.title}
								fill
								className='size-full object-cover'
							/>
						</picture>
					</CardHead>
				</header>

				<CardBody>
					{/* <p className='mt-2 text-gray-600 break-words'>{post.content}</p> */}
					<SanitizedContent content={post.content} />

					{/* <div className='flex justify-between gap-2 mt-auto'>
						<Badge variant='info' className='px-3'>
							{new Date(post.createdAt).toLocaleDateString()}
						</Badge>
						<Link
							href={`/posts/${post.slug}/${post.id}`}
							className='inline-flex justify-end'>
							<Badge variant='success' className='mt-auto hover:underline'>
								Read More
							</Badge>
						</Link>
					</div> */}
				</CardBody>
			</Card>
		</>
	);
}

export default PostSingle;
