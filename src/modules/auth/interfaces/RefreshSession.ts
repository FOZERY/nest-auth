import { Nullable } from "../../../core/types/utility.types";

export interface RefreshSession {
	id?: bigint;
	refreshToken: string;
	userId: string;
	fingerprint: string;
	ipAddress: string;
	userAgent?: Nullable<string>;
	expiresIn: bigint;
	status: string;
	createdAt?: Nullable<Date>;
}
