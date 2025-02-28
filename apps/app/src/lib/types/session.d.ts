export type SessionUser = {
	id?: string;
	name?: string;
	avatar?: string;
};

export type Session = {
	user: SessionUser;
	accessToken: string;
};
