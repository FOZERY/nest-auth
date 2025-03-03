import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageOptionsRequestDTO } from "../../../../../common/dtos/pagination/page-options.request.dto";

export class GetAllUsersRequestQueryDTO extends PageOptionsRequestDTO {
	@ApiPropertyOptional({
		type: "string",
		description: "Поиск по логину",
		example: "user123",
	})
	@IsOptional()
	@IsString()
	login?: string;
}
