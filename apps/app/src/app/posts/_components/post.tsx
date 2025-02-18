import Image from 'next/image';
import { IPost } from '@/lib/types/models';
import { Card, CardBody, CardHead } from '@/components/card';
import { Badge } from '@/components/badge';
import Link from 'next/link';

function Post({ post }: { post: IPost }) {
	return (
		<li>
			<Card className='flex-col-reverse h-full'>
				<CardBody>
					<h3 className='mt-4 font-semibold text-gray-800 text-lg'>
						{post.title}
					</h3>
					<p className='mt-2 text-gray-600 break-words'>
						{post.content.slice(0, 200)}...
					</p>

					<div className='flex justify-between gap-2 mt-auto'>
						<Badge variant='info' className='px-3'>
							{new Date(post.createdAt).toLocaleDateString()}
						</Badge>
						<Link
							href={`/posts/${post.slug}`}
							className='inline-flex justify-end'>
							<Badge variant='success' className='mt-auto hover:underline'>
								Read More
							</Badge>
						</Link>
					</div>
				</CardBody>

				<CardHead className='h-60'>
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
			</Card>
		</li>
	);
}
export default Post;
