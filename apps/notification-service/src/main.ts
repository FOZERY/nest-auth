import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, NatsStatus, Transport } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

	const config = app.get(ConfigService);
	const logger = app.get(Logger);

	const server = app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.NATS,
		options: {
			servers: config.get<string>("NATS_URL")!,
			user: config.get<string>("NATS_USER")!,
			password: config.get<string>("NATS_PASSWORD")!,
		},
	});
	server.status.subscribe((status: NatsStatus) => {
		logger.log(status, "NATS_STATUS");
	});

	app.setGlobalPrefix("/api");
	app.useLogger(logger);

	const port = config.get<number>("NOTIFICATION_SERVICE_PORT");

	await app.startAllMicroservices();
	await app.listen(port!);
}
bootstrap().catch(console.error);
