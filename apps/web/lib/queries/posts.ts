import gql from 'graphql-tag';

export const GET_PUBLISHED_POSTS = gql`
	query GetPublishedPosts(
		$limit: Int
		$page: Int
		$sortField: SortField
		$sortOrder: SortOrder
	) {
		getPublishedPosts(
			limit: $limit
			page: $page
			sortField: $sortField
			sortOrder: $sortOrder
		) {
			posts {
				id
				title
				slug
				thumbnail
				createdAt
				content
				author {
					id
					name
					avatar
				}
				tags {
					id
					name
				}
			}
			total
			pages
			currentPage
		}
	}
`;

export const GET_DASHBOARD_POSTS = gql`
	query GetDashboardPosts(
		$limit: Int
		$page: Int
		$sortField: SortField
		$sortOrder: SortOrder
	) {
		getDashboardPosts(
			limit: $limit
			page: $page
			sortField: $sortField
			sortOrder: $sortOrder
		) {
			posts {
				id
				title
				slug
				thumbnail
				published
				createdAt
				content
				author {
					id
					name
					avatar
				}
				tags {
					id
					name
				}
			}
			total
			pages
			currentPage
		}
	}
`;

export const GET_TRASH_POSTS = gql`
	query GetTrashPosts(
		$limit: Int
		$page: Int
		$sortField: SortField
		$sortOrder: SortOrder
	) {
		getTrashPosts(
			limit: $limit
			page: $page
			sortField: $sortField
			sortOrder: $sortOrder
		) {
			posts {
				id
				title
				slug
				thumbnail
				createdAt
				content
				author {
					id
					name
					avatar
				}
				tags {
					id
					name
				}
			}
			total
			pages
			currentPage
		}
	}
`;

export const GET_SINGLE_POST = gql`
	query GetSinglePost($slug: String!) {
		getPublishedPosts(where: { slug: $slug }) {
			posts {
				id
				title
				slug
				content
				thumbnail
				createdAt
				author {
					name
					avatar
				}
				tags {
					name
				}
			}
		}
	}
`;
