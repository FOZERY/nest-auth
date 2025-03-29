import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsPositive,
	IsUUID,
	Max,
	Min,
	ValidateIf,
} from "class-validator";
import { randomUUID } from "node:crypto";
import { Entity } from "../../../core/entity/Entity";
import { Nullable } from "../../../core/types/utility.types";
import { TransactionType } from "../types/transaction-type.enum";

export interface TransactionProps {
	id?: string;
	from?: Nullable<string>;
	to: string;
	amount: number;
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

	@IsNumber()
	@IsPositive()
	@Min(1)
	@Max(10_000)
	amount: number;

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
	}

	public static async create(props: TransactionProps) {
		const transaction = new Transaction(props);
		await transaction.validate();

		return transaction;
	}
}
