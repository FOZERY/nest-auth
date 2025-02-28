import {
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Query,
	UseGuards,
} from "@nestjs/common";
import { AccessTokenGuard } from "../../auth/guards/access-token-auth.guard";

import {
	PageMetaDTO,
	WithPaginatioResponseDTO,
} from "../../../common/dtos/pagination/with-pagination.response.dto";
import { GetAllUsersRequestQueryDTO } from "../dto/users/requests/get-all-users.request.dto";
import { GetUserByIdRequestDTO } from "../dto/users/requests/get-user-profile.request.dto";
import { GetUserResponseDTO } from "../dto/users/responses/get-user.response.dto";
import { UsersService } from "../services/users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Get()
	public async getAllUsers(
		@Query() queryDto: GetAllUsersRequestQueryDTO
	): Promise<WithPaginatioResponseDTO<GetUserResponseDTO>> {
		const users = await this.usersService.getAllUsersWithPagination(queryDto);
		const pageMetaDto = new PageMetaDTO({ itemCount: users.total, pageOptionsDto: queryDto });

		return new WithPaginatioResponseDTO(users.data, pageMetaDto);
	}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Get(":id")
	public async getUserById(@Param() dto: GetUserByIdRequestDTO): Promise<GetUserResponseDTO> {
		const user = await this.usersService.findById(dto.id);

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
