import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import {
	UserBalanceResetModuleJobs,
	UserBalanceResetModuleQueues,
} from "../constants/user-balance-reset.constants";

@Injectable()
export class UserBalanceResetProducer {
	constructor(
		@InjectQueue(UserBalanceResetModuleQueues.UserBalanceReset)
		private readonly userBalanceResetQueue: Queue
	) {}

	public async produce() {
		await this.userBalanceResetQueue.add(UserBalanceResetModuleJobs.UserBalanceResetJob, {});
	}
}
