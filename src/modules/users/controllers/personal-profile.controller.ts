import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Patch,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { RequestWithUser } from "../../../common/types/common.types";
import { AccessTokenGuard } from "../../auth/guards/access-token-auth.guard";
import { UpdatePersonalProfilePasswordRequestDTO } from "../dto/profiles/requests/update-profile-password.request.dto";
import { UpdatePersonalProfileRequestDTO } from "../dto/profiles/requests/update-profile.request.dto";
import { UsersService } from "../services/users.service";

@Controller("personalProfile")
@UseGuards(AccessTokenGuard)
export class PersonalProfileController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(200)
	@Get()
	public async getPersonalProfile(@Req() req: RequestWithUser) {
		const user = await this.usersService.findById(req.user.id);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		return {
			id: user.id,
			login: user.login,
			email: user.email,
			age: user.age,
			about: user.about,
			createdAt: user.createdAt,
		};
	}

	@HttpCode(200)
	@Patch()
	public async updatePersonalProfile(
		@Req() req: RequestWithUser,
		@Body() dto: UpdatePersonalProfileRequestDTO
	) {
		await this.usersService.update({
			id: req.user.id,
			...dto,
		});
	}

	@HttpCode(200)
	@Post()
	public async updatePersonalProfilePassword(
		@Req() req: RequestWithUser,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: UpdatePersonalProfilePasswordRequestDTO
	) {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("Refresh token is required");
		}

		const { refreshSession, accessToken } =
			await this.usersService.updatePersonalProfilePassword({
				oldPassword: dto.oldPassword,
				newPassword: dto.newPassword,
				refreshToken: refreshToken,
				userId: req.user.id,
				fingerprint: dto.fingerprint,
				ipAddress: dto.ipAddress,
				userAgent: dto.userAgent,
			});

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: Math.floor(refreshSession.expiresIn / 1000),
			// sameSite: 'strict',
			// secure:
		});

		return {
			accessToken,
		};
	}

	@HttpCode(200)
	@Delete()
	public async deletePersonalProfile(@Req() req: RequestWithUser) {
		await this.usersService.deleteById(req.user.id);
	}
}
