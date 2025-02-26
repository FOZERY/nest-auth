import { Request } from "express";

export type RequestWithUser = Request & {
	user: {
		id: string;
		login: string;
		email: string;
	};
};

export type AccessRefreshTokens = {
	accessToken: string;
	refreshSession: {
		refreshToken: string;
		expiresIn: bigint;
	};
};

export type AccessTokenResponse = {
	accessToken: string;
};
