import { Controller, Delete, Get, Param, Put } from "@nestjs/common";

@Controller("profiles")
export class UsersController {
	@Get()
	public async getAll() {}

	@Get(":id")
	public async getById(@Param("id") id: string) {}

	@Get("my-profile")
	public async get() {}

	@Delete(":id")
	public async deleteById(@Param("id") id: string) {}
}
