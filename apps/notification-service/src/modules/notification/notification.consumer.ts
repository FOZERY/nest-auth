import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import {
	DepositCreatedEvent,
	TransactionEvents,
	TransferCreatedEvent,
} from "@shared/events/transactions-events.types";
import { NotificationGateway } from "./notification.gateway";

@Controller()
export class NotificationConsumer {
	private readonly LOGGER = new Logger(NotificationConsumer.name);

	constructor(private readonly notificationGateway: NotificationGateway) {}

	@EventPattern(TransactionEvents.TRANSFER_CREATED)
	public handleTransferCreated(data: TransferCreatedEvent) {
		this.notificationGateway.sendNotification({
			userId: data.to,
			message: `Перевод на сумму ${data.amount} от ${data.from}, ${data.createdAt.toLocaleString()}`,
		});
		this.notificationGateway.sendNotification({
			userId: data.from,
			message: `Перевод на сумму ${data.amount} на ${data.to}, ${data.createdAt.toLocaleString()}`,
		});
	}

	@EventPattern(TransactionEvents.DEPOSIT_CREATED)
	public handleDepositCreated(data: DepositCreatedEvent) {
		this.notificationGateway.sendNotification({
			userId: data.userId,
			message: `Пополнение на сумму ${data.amount}, ${data.createdAt.toLocaleString()}`,
		});
	}
}
