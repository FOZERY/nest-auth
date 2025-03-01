import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		})
	);
	app.setGlobalPrefix("/api");
	app.use(cookieParser());

	const swaggerConfig = new DocumentBuilder()
		.setTitle("Nest Auth API")
		.setDescription("This is Nest Auth API with access/refresh tokens auth logic")
		.setVersion("1.0")
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("swagger", app, documentFactory);

	const config = app.get(ConfigService);
	const port = config.get<number>("APP_PORT");
	await app.listen(port ?? 3000);
}

bootstrap().catch(console.error);
