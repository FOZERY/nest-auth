import { ApiProperty } from "@nestjs/swagger";
import { Nullable } from "../../../../../core/types/utility.types";

export class GetUserResponseDTO {
	@ApiProperty({
		description: "User id",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	id: string;

	@ApiProperty({
		description: "User login",
		example: "login",
	})
	login: string;

	@ApiProperty({
		description: "User age",
		example: 30,
	})
	age: number;

	@ApiProperty({
		description: "About user",
		example: "About user",
		nullable: true,
	})
	about: Nullable<string>;
}
