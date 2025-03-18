export interface UploadAvatarDTO {
	userId: string;
	file: Express.Multer.File;
}
// Compare this snippet from src/modules/users/dto/profiles/services/upload-avatar-response.dto.ts:
