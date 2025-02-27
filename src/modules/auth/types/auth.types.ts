export type AccessRefreshTokens = {
	accessToken: string;
	refreshSession: {
		refreshToken: string;
		expiresIn: number;
	};
};

export type AccessTokenResponse = {
	accessToken: string;
};

export type AccessJwtPayload = {
	id: string;
	login: string;
	email: string;
	iat: number;
	exp: number;
};
