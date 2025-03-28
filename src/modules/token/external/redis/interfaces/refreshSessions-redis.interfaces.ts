import { Nullable } from "../../../../../core/types/utility.types";

export interface RefreshSessionCached {
	refreshToken: string;
	userId: string;
	fingerprint: string;
	ipAddress: Nullable<string>;
	userAgent: Nullable<string>;
	expiresAt: string;
	expiresInMs: number;
	createdAt: Nullable<string>;
}
