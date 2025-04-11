import { Global, Module } from "@nestjs/common";
import { NatsEventPublisher } from "./nats.events.publisher";
import { NatsService } from "./nats.service";

@Global()
@Module({
	imports: [],
	providers: [NatsService, NatsEventPublisher],
	exports: [NatsService, NatsEventPublisher],
})
export class NatsModule {}
