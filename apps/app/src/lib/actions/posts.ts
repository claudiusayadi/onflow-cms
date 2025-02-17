'use server';

import { fetcher } from '../fetcher';
import { print } from 'graphql';
import { GET_POST_BY_ID, GET_POSTS } from '../queries';
import { IPost } from '../types/models';
import { transformSkipTake } from '../utils/helper';

export const getPosts = async ({
	page = 0,
	limit = 12,
}: {
	page?: number;
	limit?: number;
}) => {
	const { skip, take } = transformSkipTake({ page, limit });
	const data = await fetcher(print(GET_POSTS), { skip, take });

	return { posts: data.posts as IPost[], totalPosts: data.postCount };
};

export const getPostById = async (id: string) => {
	const data = await fetcher(print(GET_POST_BY_ID), { id });

	return data.getPostById as IPost;
};
