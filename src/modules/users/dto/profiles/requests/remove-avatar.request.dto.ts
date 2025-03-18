import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class RemoveAvatarRequestDTO {
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	avatarId: string;
}
