import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});
	app.setGlobalPrefix("/api");
	app.useLogger(app.get(Logger));

	const config = app.get(ConfigService);
	const port = config.get<number>("NOTIFICATION_SERVICE_PORT");

	await app.listen(port!);
}
bootstrap().catch(console.error);
