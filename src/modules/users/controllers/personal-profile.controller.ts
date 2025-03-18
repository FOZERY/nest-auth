import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	MaxFileSizeValidator,
	NotFoundException,
	ParseFilePipe,
	Patch,
	Post,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { AccessTokenResponse } from "../../../common/dtos/tokens/access-token.response";
import { RequestWithUser } from "../../../common/types/common.types";
import { setCookieSwaggerHeader } from "../../../external/swagger/setCookieHeader.swagger";
import { AccessTokenGuard } from "../../auth/guards/access-token-auth.guard";
import { RemoveAvatarRequestDTO } from "../dto/profiles/requests/remove-avatar.request.dto";
import { UpdatePersonalProfilePasswordRequestDTO } from "../dto/profiles/requests/update-profile-password.request.dto";
import { UpdatePersonalProfileRequestDTO } from "../dto/profiles/requests/update-profile.request.dto";
import { GetPersonalProfileResponseDTO } from "../dto/profiles/responses/get-profile.response.dto";
import { UploadAvatarResponseDTO } from "../dto/profiles/responses/upload-avatar.response.dto";
import { UsersService } from "../services/users.service";

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Пользователь не авторизован" })
@ApiTags("PersonalProfile as owner of profile")
@Controller("personalProfile")
@UseGuards(AccessTokenGuard)
export class PersonalProfileController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({
		description: "Получение профиля пользователя",
		summary: "Получение профиля пользователя",
	})
	@ApiOkResponse({
		description: "Профиль пользователя был успешно получен",
		type: GetPersonalProfileResponseDTO,
	})
	@ApiNotFoundResponse({
		description: "Пользователь не найден",
	})
	@HttpCode(200)
	@Get()
	public async getPersonalProfile(
		@Req() req: RequestWithUser
	): Promise<GetPersonalProfileResponseDTO> {
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
			createdAt: user.createdAt!, // TODO: check later
		};
	}

	@ApiOperation({
		description: "Обновление профиля пользователя",
		summary: "Обновление профиля пользователя",
	})
	@ApiOkResponse({
		description: "Профиль пользователя был успешно обновлен",
	})
	@ApiNotFoundResponse({
		description: "Пользователь не найден",
	})
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

	@ApiOperation({
		description:
			"Обновление пароля пользователем. После обновления пароля, все предыдущие refreshToken'ы становятся недействительными",
		summary: "Обновление пароля пользователя",
	})
	@ApiOkResponse({
		description: "Пароль был успешно обновлен",
		headers: {
			...setCookieSwaggerHeader,
		},
		type: AccessTokenResponse,
	})
	@ApiBadRequestResponse({
		description: "Неправильный старый пароль",
	})
	@ApiNotFoundResponse({
		description: "Пользователь не найден",
	})
	@HttpCode(200)
	@Post()
	public async updatePersonalProfilePassword(
		@Req() req: RequestWithUser,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: UpdatePersonalProfilePasswordRequestDTO
	): Promise<AccessTokenResponse> {
		const { refreshSession, accessToken } =
			await this.usersService.updatePersonalProfilePassword({
				oldPassword: dto.oldPassword,
				newPassword: dto.newPassword,
				userId: req.user.id,
				fingerprint: dto.fingerprint,
				ipAddress: dto.ipAddress,
				userAgent: dto.userAgent,
			});

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: Number(refreshSession.expiresIn),
			// sameSite: 'strict',
			// secure:
		});

		return {
			accessToken,
		};
	}

	@ApiOperation({
		description: "Удаление профиля пользователя (soft-delete)",
		summary: "Удаление профиля пользователя",
	})
	@ApiOkResponse({
		description: "Профиль пользователя был успешно удален",
	})
	@HttpCode(200)
	@Delete()
	public async deletePersonalProfile(@Req() req: RequestWithUser) {
		await this.usersService.deleteById(req.user.id);
	}

	@Post("upload-avatar")
	@UseInterceptors(FileInterceptor("avatar"))
	public async uploadAvatar(
		@Req() req: RequestWithUser,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
					new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
				],
			})
		)
		file: Express.Multer.File
	): Promise<UploadAvatarResponseDTO> {
		return await this.usersService.uploadPersonalProfileAvatar({
			userId: req.user.id,
			file: file,
		});
	}

	@Delete("avatar")
	public async softDeleteAvatar(
		@Req() req: RequestWithUser,
		@Body() dto: RemoveAvatarRequestDTO
	) {
		await this.usersService.softDeletePersonalProfileAvatar({
			userId: req.user.id,
			avatarId: dto.avatarId,
		});
	}
}
