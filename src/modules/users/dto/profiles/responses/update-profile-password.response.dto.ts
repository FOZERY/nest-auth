import { ApiProperty } from "@nestjs/swagger";

export class UpdatePersonalProfilePasswordResponseDTO {
	@ApiProperty({ description: "Новый access token" })
	accessToken: string;
}
