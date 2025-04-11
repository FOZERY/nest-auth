import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class NatsService implements OnModuleInit {
	private readonly logger = new Logger(NatsService.name);

	private client: ClientProxy;

	constructor(private readonly configService: ConfigService) {
		this.client = ClientProxyFactory.create({
			transport: Transport.NATS,
			options: {
				servers: this.configService.get<string>("NATS_URL")!,
				user: this.configService.get<string>("NATS_USER")!,
				password: this.configService.get<string>("NATS_PASSWORD")!,
			},
		});
	}

	async onModuleInit() {
		await this.client.connect();
		this.client.status.subscribe((status) => {
			this.logger.debug(`Nats status: ${status}`);
		});
	}

	async onModuleDestroy() {
		await this.client.close();
	}

	publish(topic: string, event: any): void {
		this.client.emit(topic, event);
	}
}
