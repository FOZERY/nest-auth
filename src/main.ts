import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix("/api");
	app.use(cookieParser());

	const config = app.get(ConfigService);

	const port = config.get<number>("APP_PORT");
	await app.listen(port ?? 3000);
}

bootstrap().catch(console.error);
