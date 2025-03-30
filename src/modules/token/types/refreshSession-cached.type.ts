import { Nullable } from "../../../core/types/utility.types";

export type RefreshSessionCached = {
	refreshToken: string;
	expiresAt: number;
	createdAt: number;
	userId: string;
	ipAddress: Nullable<string>;
	userAgent: Nullable<string>;
	fingerprint: string;
};
