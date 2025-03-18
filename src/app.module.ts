import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ClsModule } from "nestjs-cls";
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
