import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

export function mainConfig(app: INestApplication) {
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				exposeDefaultValues: true,
				exposeUnsetFields: true,
			},
		})
	);
	app.setGlobalPrefix("/api");
	app.use(cookieParser());
}
