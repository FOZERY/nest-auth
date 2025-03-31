export interface UpdatePersonalPasswordServiceDTO {
	userId: string;
	oldPassword: string;
	newPassword: string;
	ipAddress: string;
	fingerprint: string;
	userAgent: string;
}
