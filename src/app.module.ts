import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./env/${process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"}`,
		}),
		UsersModule,
		AuthModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
