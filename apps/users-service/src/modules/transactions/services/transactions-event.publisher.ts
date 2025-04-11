import { Injectable } from "@nestjs/common";
import {
	DepositCreatedEvent,
	TransactionEvents,
	TransferCreatedEvent,
} from "@shared/events/transactions-events.types";
import { EventsPublisher } from "apps/users-service/src/core/interfaces/event-publisher.interface";

@Injectable()
export class TransactionsEventsPublisher {
	constructor(private readonly eventPublisher: EventsPublisher) {}

	transferCreated(event: TransferCreatedEvent): void {
		this.eventPublisher.publish(TransactionEvents.TRANSFER_CREATED, [event]);
	}

	depositCreated(event: DepositCreatedEvent): void {
		this.eventPublisher.publish(TransactionEvents.DEPOSIT_CREATED, [event]);
	}
}
