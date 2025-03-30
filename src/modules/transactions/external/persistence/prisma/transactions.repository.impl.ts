import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional/dist/src/lib/transaction-host";
import { Injectable } from "@nestjs/common";
import { Nullable } from "../../../../../core/types/utility.types";
import { Transaction } from "../../../entities/Transaction";
import { TransactionsRepository } from "../../../repositories/transactions.repository";
import { TransactionType } from "../../../types/transaction-type.enum";

@Injectable()
export class TransactionsRepositoryImpl implements TransactionsRepository {
	constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

	public async create(transaction: Transaction): Promise<{
		id: string;
		amount: number;
		createdAt: Date;
		from: Nullable<string>;
		to: string;
		type: TransactionType;
	}> {
		if (transaction.type !== TransactionType.SYSTEM_DEPOSIT && !transaction.from) {
			throw new Error("From user is required");
		}

		const createdTransaction = await this.txHost.tx.transactions.create({
			data: {
				id: transaction.id,
				amount: transaction.amount.toNumber(),
				from_user_id: transaction.from,
				to_user_id: transaction.to,
				type: transaction.type,
			},
		});

		return {
			id: createdTransaction.id,
			amount: createdTransaction.amount.toNumber(),
			createdAt: createdTransaction.created_at,
			from: createdTransaction.from_user_id ?? null,
			to: createdTransaction.to_user_id,
			type: createdTransaction.type as TransactionType,
		};
	}
}
