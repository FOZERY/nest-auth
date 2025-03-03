import { ApiProperty } from "@nestjs/swagger";
import { Nullable } from "../../../../../core/types/utility.types";

export class GetPersonalProfileResponseDTO {
	@ApiProperty({
		description: "User ID",
		example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
	})
	id: string;

	@ApiProperty({
		description: "Login",
		example: "login",
	})
	login: string;

	@ApiProperty({
		description: "Email",
		example: "Email",
	})
	email: string;

	@ApiProperty({
		description: "Age",
		example: 20,
	})
	age: number;

	@ApiProperty({
		description: "About",
		example: "About",
		nullable: true,
		maxLength: 1000,
	})
	about: Nullable<string>;

	@ApiProperty({
		description: "Created at",
		example: "2021-07-01T12:00:00.000Z",
	})
	createdAt: Date;
}
