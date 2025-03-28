import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { S3Service } from "../../../external/s3/s3.service";
import { FileModuleQueues } from "../file.constants";
import { FileOperationTypes, S3CommandOptions } from "./file-processing.producer";

@Processor(FileModuleQueues.FileProcessing)
export class FileProcessingQueueConsumer extends WorkerHost {
	private readonly LOGGER = new Logger(FileProcessingQueueConsumer.name);
	constructor(private readonly s3Service: S3Service) {
		super();
	}

	async process(job: Job<S3CommandOptions, any, FileOperationTypes>) {
		this.LOGGER.log(
			{
				id: job.id,
				name: job.name,
				data: job.data,
			},
			`Processing job ${job.id} ${job.name}`
		);
		const operation = job.data;
		switch (job.name) {
			case FileOperationTypes.DELETE:
				this.LOGGER.log(
					{
						bucket: operation.bucket,
						key: operation.key,
					},
					"Deleting file"
				);
				await this.s3Service.deleteFile({
					Bucket: operation.bucket,
					Key: operation.key,
				});
				break;
		}
	}
}
