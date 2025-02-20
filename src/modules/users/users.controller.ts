import { Controller, Delete, Get, Param, Put } from "@nestjs/common";

@Controller("profiles")
export class UsersController {
	@Get()
	public async getAll() {}

	@Get(":id")
	public async getById(@Param("id") id: string) {}

	@Put(":id")
	public async updateById(@Param("id") id: string) {}

	@Get("my")
	public async get() {}

	@Delete(":id")
	public async deleteById(@Param("id") id: string) {}
}
