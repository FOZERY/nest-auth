import { validate, ValidationError } from "class-validator";

export abstract class Entity<TId extends number | string | bigint> {
	protected _id?: TId;

	constructor(id?: TId) {
		this._id = id;
	}

	public async validate(): Promise<void> {
		const errors = await validate(this);
		if (errors.length > 0) {
			throw new Error("Domain entity validation error", {
				cause: this.formatValidationErrors(errors),
			});
		}
	}

	private formatValidationErrors(errors: ValidationError[]): string {
		return JSON.stringify(errors, undefined, 2);
	}
}
