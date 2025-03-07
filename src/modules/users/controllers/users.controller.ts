import {
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
	UseGuards,
} from "@nestjs/common";
import { AccessTokenGuard } from "../../auth/guards/access-token-auth.guard";

import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import {
	PageMetaDTO,
	WithPaginationResponseDTO,
} from "../../../common/dtos/pagination/with-pagination.response.dto";
import { ApiPaginatedOkResponse } from "../../../external/swagger/decorators/apiPaginatedOkResponse.swagger";
import { GetAllUsersRequestQueryDTO } from "../dto/users/requests/get-all-users.request.dto";
import { GetUserByIdRequestDTO } from "../dto/users/requests/get-user-profile.request.dto";
import { GetUserResponseDTO } from "../dto/users/responses/get-user.response.dto";
import { UsersService } from "../services/users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({
		summary: "Получить всех пользователей с пагинацией",
		description: "Получить всех пользователей с пагинацией",
	})
	@ApiPaginatedOkResponse(GetUserResponseDTO)
	@ApiBearerAuth()
	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Get()
	public async paginate(
		@Query() queryDto: GetAllUsersRequestQueryDTO
	): Promise<WithPaginationResponseDTO<GetUserResponseDTO>> {
		const users = await this.usersService.getAllUsersWithPagination(queryDto);
		const pageMetaDto = new PageMetaDTO({ itemCount: users.total, pageOptionsDto: queryDto });

		return new WithPaginationResponseDTO(users.data, pageMetaDto);
	}

	@ApiOperation({
		summary: "Получить профиль пользователя",
		description: "Получить профиль пользователя",
	})
	@ApiOkResponse({
		type: GetUserResponseDTO,
		description: "Успешно получен профиль пользователя",
	})
	@ApiNotFoundResponse({ description: "Пользователь не найден" })
	@ApiBearerAuth()
	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Get(":id")
	public async getUserById(@Param("id", ParseUUIDPipe) id: string): Promise<GetUserResponseDTO> {
		const user = await this.usersService.findById(id);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		return {
			id: user.id,
			login: user.login,
			age: user.age,
			about: user.about,
		};
	}
}
