import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import {
	UserBalanceResetModuleJobs,
	UserBalanceResetModuleQueues,
} from "../constants/user-balance-reset.constants";

@Injectable()
export class UserBalanceResetProducer {
	private readonly logger = new Logger(UserBalanceResetProducer.name);

	constructor(
		@InjectQueue(UserBalanceResetModuleQueues.UserBalanceReset)
		private readonly userBalanceResetQueue: Queue
	) {}

	public async produce() {
		this.logger.debug("Producing job to reset balance for all users");
		await this.userBalanceResetQueue.add(UserBalanceResetModuleJobs.UserBalanceResetJob, {});
		this.logger.debug("Job produced to reset balance for all users");
	}
}
