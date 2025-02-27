import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "./logger.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { TokenModule } from "./modules/token/token.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./env/${process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"}`,
		}),
		UsersModule,
		AuthModule,
		TokenModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
