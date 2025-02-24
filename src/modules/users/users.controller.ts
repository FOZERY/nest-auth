import { Controller, Delete, Get, Param, Put } from "@nestjs/common";

@Controller("users")
export class UsersController {
	@Get()
	public async getAll() {
		return "get all users";
	}

	@Get(":id")
	public async getById(@Param("id") id: string) {
		return `get user with id=${id}`;
	}

	@Put()
	public async update() {}

	@Delete(":id")
	public async deleteById(@Param("id") id: string) {
		return `delete user with id=${id}`;
	}

	@Get("my-profile")
	public async getMyProfile() {}

	@Put("my-profile")
	public async updateMyProfile() {}

	@Delete("my-profile")
	public async deleteMyProfile() {}
}
