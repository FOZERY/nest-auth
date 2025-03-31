import Decimal from "decimal.js";
import { IsDecimalJS } from "../../common/class-validator/isDecimal.decorator";

export class Money {
	@IsDecimalJS()
	private readonly amount: Decimal;

	private constructor(amount: Decimal) {
		this.amount = amount;
	}

	public static fromNumber(amount: number): Money {
		if (!Number.isFinite(amount)) {
			throw new Error("Money amount must be a finite number");
		}

		if (amount < 0) {
			throw new Error("Money amount cannot be negative");
		}

		return new Money(new Decimal(amount));
	}

	public static fromString(amount: string): Money {
		const number = Number(amount);
		if (isNaN(number)) {
			throw new Error("Invalid money amount string");
		}
		return Money.fromNumber(number);
	}

	public static zero(): Money {
		return new Money(new Decimal(0));
	}

	public add(other: Money): Money {
		return new Money(this.amount.plus(other.amount).toDecimalPlaces(2));
	}

	public subtract(other: Money): Money {
		const result = this.amount.minus(other.amount);

		if (result.isNegative()) {
			throw new Error("Insufficient funds");
		}

		return new Money(result.toDecimalPlaces(2));
	}

	public multiply(factor: number): Money {
		if (!Number.isFinite(factor)) {
			throw new Error("Multiplication factor must be a finite number");
		}
		return new Money(this.amount.mul(factor).toDecimalPlaces(2));
	}

	public equals(other: Money): boolean {
		return this.amount.equals(other.amount);
	}

	public isGreaterThan(other: Money): boolean {
		return this.amount.greaterThan(other.amount);
	}

	public isLessThan(other: Money): boolean {
		return this.amount.lessThan(other.amount);
	}

	public toString(): string {
		return this.amount.toString();
	}

	public toNumber(): number {
		return this.amount.toNumber();
	}

	public toDecimal(): Decimal {
		return this.amount;
	}
}
