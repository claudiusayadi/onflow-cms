'use server';

import { fetcher } from '../fetcher';
import { print } from 'graphql';
import { GET_POSTS } from '../queries';
import { IPost } from '../types/models';

export const getPosts = async () => {
	const data = await fetcher(print(GET_POSTS));
	return data.posts as IPost[];
};
