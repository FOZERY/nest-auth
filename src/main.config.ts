import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

export function mainConfig(app: INestApplication) {
	console.log(process.env.NODE_ENV);
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
