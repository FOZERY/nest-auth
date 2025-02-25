export interface RefreshSession {
	id?: string;
	refreshToken: string;
	userId: string;
	userAgent: string;
	deviceId: string;
	ipAddress: string;
	expiresIn: number;
	status: "active" | "deactivated";
	createdAt?: Date;
}
