import { IsUUID } from "class-validator";

export class GetUserByIdRequestDTO {
	@IsUUID()
	id: string;
}
