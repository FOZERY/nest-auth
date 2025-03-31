import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { TransactionsController } from "./controllers/transactions.controller";
import { TransactionsRepositoryImpl } from "./external/prisma/transactions.repository.impl";
import { TransactionsService } from "./services/transactions.service";

@Module({
	imports: [UsersModule],
	controllers: [TransactionsController],
	providers: [TransactionsService, TransactionsRepositoryImpl],
	exports: [TransactionsService],
})
export class TransactionsModule {}
