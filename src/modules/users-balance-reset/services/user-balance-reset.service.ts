import { Injectable } from "@nestjs/common";
import { UserBalanceResetProducer } from "../queue/user-balance-reset.producer";

@Injectable()
export class UserBalanceResetService {
	constructor(private readonly userBalanceResetProducer: UserBalanceResetProducer) {}

	public async resetBalance() {
		await this.userBalanceResetProducer.produce();
	}
}
