import { BadRequestException } from "@nestjs/common";
import { validate, ValidationError } from "class-validator";

export abstract class EntityWithGeneratedId<TId extends number | string> {
	protected _id?: TId;

	public get id(): TId | undefined {
		return this._id;
	}

	public async validate(): Promise<void> {
		const errors = await validate(this);
		if (errors.length > 0) {
			throw new BadRequestException("Domain entity validation error", {
				cause: this.formatValidationErrors(errors),
				description: "Domain entity validation error",
			});
		}
	}

	private formatValidationErrors(errors: ValidationError[]): string {
		return JSON.stringify(errors, undefined, 2);
	}
}
