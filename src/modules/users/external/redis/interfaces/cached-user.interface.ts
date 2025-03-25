export interface CachedUser {
	id: string;
	login: string;
	email: string;
	password: string;
	age: number;
	about: string | null;
	avatars: CachedAvatar[];
	updatedAt: string | null;
	createdAt: string | null;
	deletedAt: string | null;
}

export interface CachedAvatar {
	id: string;
	userId: string;
	path: string;
	active: boolean;
	createdAt: string | null;
	updatedAt: string | null;
	deletedAt: string | null;
}
