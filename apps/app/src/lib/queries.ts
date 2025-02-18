import gql from 'graphql-tag';

export const GET_POSTS = gql`
	query posts($skip: Float, $take: Float) {
		posts(skip: $skip, take: $take) {
			id
			title
			content
			slug
			thumbnail
			published
			createdAt
			updatedAt
		}
		postCount
	}
`;

export const GET_POST_BY_ID = gql`
	query getPostById($id: String!) {
		getPostById(id: $id) {
			id
			title
			content
			thumbnail
			published
			createdAt
			updatedAt
			author {
				name
			}
			tags {
				id
				name
			}
		}
	}
`;

export const GET_POST_BY_SLUG = gql`
	query GetPostBySlug($slug: String!) {
		getPostBySlug(slug: $slug) {
			id
			title
			content
			thumbnail
			published
			createdAt
			updatedAt
			author {
				name
			}
			tags {
				id
				name
			}
		}
	}
`;
