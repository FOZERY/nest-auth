import { Controller, Delete, Get, Param, Put, Request, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../auth/guards/access-token-auth.guard";

@Controller("users")
export class UsersController {
	@Get()
	public async getAll() {
		return "get all users";
	}

	@Put()
	public async update() {}

	@Delete(":id")
	public async deleteById(@Param("id") id: string) {
		return `delete user with id=${id}`;
	}

	@UseGuards(AccessTokenGuard)
	@Get("my-profile")
	public async getMyProfile(@Request() req) {
		return req.user;
	}

	@Put("my-profile")
	public async updateMyProfile() {}

	@Delete("my-profile")
	public async deleteMyProfile() {}
}
