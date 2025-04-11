export enum TransactionEvents {
	TRANSFER_CREATED = "transactions.transfer.created",
	DEPOSIT_CREATED = "transactions.deposit.created",
}

export type TransferCreatedEvent = {
	from: string;
	to: string;
	amount: number;
	createdAt: Date;
};

export type DepositCreatedEvent = {
	userId: string;
	amount: number;
	createdAt: Date;
};
