export interface CreateRefreshSessionDTO {
	userId: string;
	ipAddress: string;
	fingerprint: string;
	userAgent?: string;
}
