import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { getPinoConfig } from "@pino-shared";
import { LoggerModule } from "nestjs-pino";

@Module({
	imports: [
		LoggerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return getPinoConfig({
					nodeEnv: configService.get<string>("NODE_ENV")!,
					appName: configService.get<string>("NOTIFICATION_SERVICE_NAME")!,
					logLevel: configService.get<string>("LOG_LEVEL")!,
					logToConsole: configService.get<boolean>("LOG_TO_CONSOLE")!,
					autoLogging: configService.get<boolean>("LOG_AUTO_LOGGING")!,
					quietReqLogger: configService.get<boolean>("LOG_QUIET_REQ_LOGGER")!,
					quietResLogger: configService.get<boolean>("LOG_QUIET_RES_LOGGER")!,
				});
			},
		}),
	],
})
export class ExternalModule {}
