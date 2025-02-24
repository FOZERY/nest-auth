import { InternalServerErrorException } from "@nestjs/common";
import { IsString, validate } from "class-validator";
import { randomUUID } from "node:crypto";
export abstract class Entity {
	@IsString()
	protected id?: string;

	constructor(id?: string) {
		this.id = id ?? randomUUID({ disableEntropyCache: true });
	}

	protected static async validate(entity: Entity) {
		const errors = await validate(entity);
		if (errors.length > 0) {
			throw new InternalServerErrorException("Domain entity validation error", {
				cause: JSON.stringify(errors, undefined, 2),
				description: "Domain entity validation error",
			});
		}
	}
}
