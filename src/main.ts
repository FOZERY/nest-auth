import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { mainConfig } from "./main.config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	mainConfig(app);

	const config = app.get(ConfigService);

	if (config.get<string>("NODE_ENV") !== "production") {
		const swaggerConfig = new DocumentBuilder()
			.setTitle("Nest Auth API")
			.setDescription("This is Nest Auth API with access/refresh tokens auth logic")
			.setVersion("1.0")
			.addCookieAuth("refreshToken")
			.addBearerAuth()
			.build();
		const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup("swagger", app, documentFactory);
	}

	const port = config.get<number>("APP_PORT");
	await app.listen(port ?? 3000);
}

bootstrap().catch(console.error);
