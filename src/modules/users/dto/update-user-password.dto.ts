export interface UpdateUserPasswordDTO {
	userId: string;
	refreshToken: string;
	oldPassword: string;
	newPassword: string;
	ipAddress: string;
	fingerprint: string;
	userAgent?: string;
}
