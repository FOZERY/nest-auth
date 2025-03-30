import { Type } from "class-transformer";
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsUUID,
	ValidateIf,
	ValidateNested,
} from "class-validator";
import { randomUUID } from "node:crypto";
import { Entity } from "../../../core/entity/Entity";
import { Nullable } from "../../../core/types/utility.types";
import { Money } from "../../../core/value-objects/Money";
import { TransactionType } from "../types/transaction-type.enum";

export interface TransactionProps {
	id?: string;
	from?: Nullable<string>;
	to: string;
	amount: Money;
	type: TransactionType;
	createdAt?: Nullable<Date>;
}

export class Transaction extends Entity {
	@IsUUID()
	public id: string;

	@ValidateIf((o: Transaction) => o.type !== TransactionType.SYSTEM_DEPOSIT)
	@IsUUID()
	from: Nullable<string>;

	@IsUUID()
	to: string;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => Money)
	amount: Money;

	@IsEnum(TransactionType)
	type: TransactionType;

	@IsOptional()
	createdAt: Nullable<Date>;

	private constructor(props: TransactionProps) {
		super();
		this.id = props.id ?? randomUUID();
		this.from = props.from ?? null;
		this.to = props.to;
		this.amount = props.amount;
		this.type = props.type;
		this.createdAt = props.createdAt ?? null;

		if (this.amount.isLessThan(Money.fromNumber(0))) {
			throw new Error("Amount cannot be negative");
		}

		if (this.amount.isGreaterThan(Money.fromNumber(10_000))) {
			throw new Error("Amount cannot be greater than 10,000");
		}
	}

	public static async create(props: TransactionProps) {
		const transaction = new Transaction(props);
		await transaction.validate();

		return transaction;
	}
}
