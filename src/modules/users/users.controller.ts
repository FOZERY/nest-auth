import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Req,
	Request,
	UseGuards,
} from "@nestjs/common";
import { AccessTokenGuard } from "../auth/guards/access-token-auth.guard";
import { UpdateMyProfileDTO } from "./dto/update-my-profile.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Get("my-profile")
	public async getMyProfile(@Request() req) {
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

	@UseGuards(AccessTokenGuard)
	@Patch("my-profile")
	public async updateMyProfile(@Req() req: any, @Body() dto: UpdateMyProfileDTO) {
		await this.usersService.update({
			id: req.user.id,
			...dto,
		});
	}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Delete("my-profile")
	public async deleteMyProfile(@Req() req) {
		await this.usersService.deleteById(req.user.id);
	}
}
