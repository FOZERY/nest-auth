import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { RequestWithUser } from "../../common/types/common.types";
import { AccessTokenGuard } from "../auth/guards/access-token-auth.guard";
import { GetUserProfileDTO } from "./dto/get-user-profile.dto";
import { UpdateMyProfilePasswordDTO } from "./dto/update-my-profile-password.dto";
import { UpdateMyProfileDTO } from "./dto/update-my-profile.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Get()
	public async getManyUsersProfiles(
		@Query("page") page: number = 1,
		@Query("take") take: number = 10
	) {}

	@HttpCode(200)
	@Get(":id")
	public async getUserProfile(@Param() dto: GetUserProfileDTO) {}
}
