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
import { RequestWithUser } from "../../common/types/common.types";
import { AccessTokenGuard } from "../auth/guards/access-token-auth.guard";
import { UpdateMyProfilePasswordDTO } from "./dto/update-my-profile-password.dto";
import { UpdateMyProfileDTO } from "./dto/update-my-profile.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Get("my-profile")
	public async getMyProfile(@Req() req: RequestWithUser) {
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
	@UseGuards(AccessTokenGuard)
	@Patch("my-profile")
	public async updateMyProfile(@Req() req: RequestWithUser, @Body() dto: UpdateMyProfileDTO) {
		await this.usersService.update({
			id: req.user.id,
			...dto,
		});
	}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Post("my-profile/update-password")
	public async updateMyProfilePassword(
		@Req() req: RequestWithUser,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: UpdateMyProfilePasswordDTO
	) {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("Refresh token is required");
		}

		const { refreshSession, accessToken } =
			await this.usersService.updateProfilePasswordByUserId({
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
	@UseGuards(AccessTokenGuard)
	@Delete("my-profile")
	public async deleteMyProfile(@Req() req: RequestWithUser) {
		await this.usersService.deleteById(req.user.id);
	}
}
