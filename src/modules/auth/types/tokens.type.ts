export type Tokens = {
	accessToken: string;
	refreshSession: {
		refreshToken: string;
		expiresIn: bigint;
	};
};
