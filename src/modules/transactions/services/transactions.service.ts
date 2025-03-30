import { Transactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Nullable } from "../../../core/types/utility.types";
import { Money } from "../../../core/value-objects/Money";
import { UsersService } from "../../users/services/users.service";
import { CreateDepositRequestDto } from "../dtos/requests/create-deposit.request.dto";
import { CreateTransferRequestDto } from "../dtos/requests/create-transfer.request.dto";
import { Transaction } from "../entities/Transaction";
import { TransactionsRepositoryImpl } from "../external/persistence/prisma/transactions.repository.impl";
import { TransactionsRepository } from "../repositories/transactions.repository";
import { TransactionType } from "../types/transaction-type.enum";

@Injectable()
export class TransactionsService {
	constructor(
		@Inject(TransactionsRepositoryImpl)
		private readonly transactionsRepository: TransactionsRepository,
		private readonly usersService: UsersService
	) {}

	@Transactional<TransactionalAdapterPrisma>({
		isolationLevel: "RepeatableRead",
	})
	public async createTransfer(dto: CreateTransferRequestDto & { from: string }): Promise<{
		id: string;
		amount: number;
		createdAt: Date;
		from: Nullable<string>;
		to: string;
		type: TransactionType;
	}> {
		const amount = Money.fromNumber(dto.amount);

		const fromUser = await this.usersService.getByIdForUpdate(dto.from);
		const toUser = await this.usersService.getByIdForUpdate(dto.to);

		if (!fromUser || !toUser) {
			throw new NotFoundException("User not found");
		}

		if (fromUser.balance.isLessThan(amount)) {
			throw new BadRequestException("Insufficient balance");
		}

		await fromUser.setBalance(fromUser.balance.subtract(amount));
		await toUser.setBalance(toUser.balance.add(amount));

		const transaction = await Transaction.create({
			from: dto.from,
			to: dto.to,
			amount: amount,
			type: TransactionType.TRANSFER,
		});

		const createdTransaction = await this.transactionsRepository.create(transaction);
		await this.usersService.updateBalance(fromUser.id, fromUser.balance);
		await this.usersService.updateBalance(toUser.id, toUser.balance);

		return {
			id: createdTransaction.id,
			amount: createdTransaction.amount,
			createdAt: createdTransaction.createdAt,
			from: createdTransaction.from,
			to: createdTransaction.to,
			type: createdTransaction.type,
		};
	}

	@Transactional<TransactionalAdapterPrisma>({
		isolationLevel: "RepeatableRead",
	})
	public async createDeposit(dto: CreateDepositRequestDto & { userId: string }): Promise<{
		id: string;
		amount: number;
		createdAt: Date;
		to: string;
		type: TransactionType;
	}> {
		const amount = Money.fromNumber(dto.amount);

		const user = await this.usersService.getByIdForUpdate(dto.userId);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		await user.setBalance(user.balance.add(amount));

		const transaction = await Transaction.create({
			to: dto.userId,
			amount: amount,
			type: TransactionType.SYSTEM_DEPOSIT,
		});

		const createdTransaction = await this.transactionsRepository.create(transaction);
		await this.usersService.updateBalance(user.id, user.balance);

		return {
			id: createdTransaction.id,
			amount: createdTransaction.amount,
			createdAt: createdTransaction.createdAt,
			to: createdTransaction.to,
			type: createdTransaction.type,
		};
	}
}
