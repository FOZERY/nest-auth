import { Injectable } from "@nestjs/common";
import { EventsPublisher } from "apps/users-service/src/core/interfaces/event-publisher.interface";
import { NatsService } from "./nats.service";

@Injectable()
export class NatsEventPublisher implements EventsPublisher {
	constructor(private readonly natsService: NatsService) {}

	publish(topic: string, events: Array<any>): void {
		for (const event of events) {
			this.natsService.publish(topic, event);
		}
	}

	publishWithKey(topic: string, key: string, events: Array<any>): void {
		for (const event of events) {
			this.natsService.publish(topic, {
				key,
				event,
			});
		}
	}
}
