import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { UsersService } from "../../users/services/users.service";
import {
	UserBalanceResetModuleJobs,
	UserBalanceResetModuleQueues,
} from "../constants/user-balance-reset.constants";

@Processor(UserBalanceResetModuleQueues.UserBalanceReset)
export class UserBalanceResetConsumer extends WorkerHost {
	constructor(private readonly usersService: UsersService) {
		super();
	}

	public async process(job: Job<any, any, UserBalanceResetModuleJobs>): Promise<void> {
		switch (job.name) {
			case UserBalanceResetModuleJobs.UserBalanceResetJob: {
				await this.usersService.resetAllUsersBalance();
				return;
			}
		}
	}
}
