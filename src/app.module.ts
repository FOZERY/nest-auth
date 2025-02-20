import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `./env/.${process.env.NODE_ENV || "development"}.env`,
			isGlobal: true,
		}),
		UsersModule,
		AuthModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
