import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { UserBalanceResetModuleQueues } from "./constants/user-balance-reset.constants";
import { UserBalanceResetController } from "./controllers/user-balance-reset.controller";
import { UserBalanceResetConsumer } from "./queue/user-balance-reset.consumer";
import { UserBalanceResetProducer } from "./queue/user-balance-reset.producer";
import { UserBalanceResetService } from "./services/user-balance-reset.service";

@Module({
	imports: [
		UsersModule,
		BullModule.registerQueue({
			name: UserBalanceResetModuleQueues.UserBalanceReset,
		}),
	],
	controllers: [UserBalanceResetController],
	providers: [UserBalanceResetProducer, UserBalanceResetConsumer, UserBalanceResetService],
})
export class UserBalanceResetModule {}
