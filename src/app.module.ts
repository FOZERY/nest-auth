import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import { PrismaModule } from "./external/persistence/prisma/prisma.module";
import { PrismaService } from "./external/persistence/prisma/prisma.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
@Module({
	imports: [
		// TODO: check bestpractices for configmodule
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: process.env.NODE_ENV === "production",
			envFilePath: `./env/.env.${process.env.NODE_ENV === "test" ? "test" : "dev"}`,
		}),
		LoggerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				const level: string = config.get<string>("LOG_LEVEL") ?? "info";

				const targets: any[] = [];

				if (config.get("LOG_TO_CONSOLE") === "true") {
					if (process.env.NODE_ENV === "development") {
						targets.push({
							target: "pino-pretty",
							options: {
								colorize: true,
								singleLine: true,
							},
						});
					} else {
						targets.push({
							target: "pino/file",
							options: {
								destination: 1,
							},
						});
					}
				}

				return {
					pinoHttp: {
						level: level,
						genReqId: (req) => {
							return req.id ?? crypto.randomUUID();
						},
						autoLogging: true,
						transport: {
							targets: targets,
						},
					},
				};
			},
		}),
		ClsModule.forRoot({
			plugins: [
				new ClsPluginTransactional({
					imports: [PrismaModule],
					adapter: new TransactionalAdapterPrisma({
						prismaInjectionToken: PrismaService,
					}),
				}),
			],
		}),
		UsersModule,
		AuthModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
				transform: true,
				transformOptions: {
					exposeDefaultValues: true,
					exposeUnsetFields: true,
				},
			}),
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(cookieParser()).forRoutes("*");
	}
}
