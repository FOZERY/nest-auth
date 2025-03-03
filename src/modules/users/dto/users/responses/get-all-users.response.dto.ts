import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDTO } from "../../../../../common/dtos/pagination/with-pagination.response.dto";
import { GetUserResponseDTO } from "./get-user.response.dto";

export class GetAllUsersResponseDTO {
	@ApiProperty({
		description: "Список пользователей",
		type: [GetUserResponseDTO],
	})
	readonly data: GetUserResponseDTO[];

	@ApiProperty({
		description: "Метаданные пагинации",
		type: PageMetaDTO,
	})
	readonly meta: PageMetaDTO;

	constructor(data: GetUserResponseDTO[], meta: PageMetaDTO) {
		this.data = data;
		this.meta = meta;
	}
}
