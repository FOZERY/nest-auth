import { validate, ValidationError } from "class-validator";

export abstract class Entity<TId extends number | string | bigint> {
	protected _id?: TId;

	constructor(id?: TId) {
		this._id = id;
	}

	protected async validate(): Promise<void> {
		const errors = await validate(this);
		if (errors.length > 0) {
			throw new Error("Domain entity validation error", {
				cause: this.formatValidationErrors(errors),
			});
		}
	}

	private formatValidationErrors(errors: ValidationError[]): string {
		return JSON.stringify(
			errors,
			(key, value) => (typeof value === "bigint" ? value.toString() : value),
			2
		);
	}
}
