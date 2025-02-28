import { IsUUID } from "class-validator";

export class GetUserProfileDTO {
	@IsUUID()
	id: string;
}
