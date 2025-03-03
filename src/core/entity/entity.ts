import { validate } from "class-validator";
import { DomainValidationError, DomainValidationErrors } from "../errors/DomainValidationError";

export abstract class Entity<TId extends number | string | bigint> {
	protected _id?: TId;

	constructor(id?: TId) {
		this._id = id;
	}

	protected async validate(): Promise<void> {
		const domainErrors: DomainValidationErrors[] = [];
		const errors = await validate(this);

		if (errors.length > 0) {
			errors.forEach((error) => {
				domainErrors.push({
					property: error.property,
					value: error.value,
					message: error.constraints ? Object.values(error.constraints) : [],
				});
			});

			throw new DomainValidationError(this, domainErrors);
		}
	}
}
