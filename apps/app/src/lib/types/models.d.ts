export interface IUser {
	id: string;
	email: string;
	password: string;
	name: string;
	bio?: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;

	// posts?: IPost[];
	// comments?: IComment[];
	// likes?: ILike[];
}

export interface IPost {
	id: string;
	title: string;
	content: string;
	slug: string;
	thumbnail: string;
	published: boolean;
	authorId: string;
	author: IUser;
	comments?: IComment[];
	tags?: ITag[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IComment {
	id: string;
	content: string;
	authorId: string;
	postId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ITag {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ILike {
	id: string;
	userId: string;
	postId: string;
	createdAt: Date;
	updatedAt: Date;
}
