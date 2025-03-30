import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import Decimal from "decimal.js";

@ValidatorConstraint({ name: "isDecimal", async: false })
export class IsDecimalConstraint implements ValidatorConstraintInterface {
	validate(value: any) {
		if (value instanceof Decimal) {
			return true;
		}

		return false;
	}

	defaultMessage(args: ValidationArguments) {
		return `${args.property} must be a valid decimal.js number`;
	}
}

export function IsDecimalJS(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsDecimalConstraint,
		});
	};
}
