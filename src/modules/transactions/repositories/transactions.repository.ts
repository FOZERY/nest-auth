import { Nullable } from "../../../core/types/utility.types";
import { Transaction } from "../entities/Transaction";
import { TransactionType } from "../types/transaction-type.enum";

export interface TransactionsRepository {
	create(transaction: Transaction): Promise<{
		id: string;
		amount: number;
		createdAt: Date;
		from: Nullable<string>;
		to: string;
		type: TransactionType;
	}>;
}
