import { ObjectCannedACL } from "@aws-sdk/client-s3";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { JobsOptions, Queue } from "bullmq";
import { FileModuleQueues } from "../file.constants";

export enum FileOperationTypes {
	DELETE = "DELETE",
	UPLOAD = "UPLOAD",
}

export interface S3CommandOptions {
	bucket: string;
	key: string;
	contentType?: string;
	acl?: ObjectCannedACL;
}

@Injectable()
export class FileProcessingQueueProducer {
	private readonly LOGGER = new Logger(FileProcessingQueueProducer.name);
	constructor(
		@InjectQueue(FileModuleQueues.FileProcessing)
		private readonly fileProcessingQueue: Queue
	) {}

	async produce(type: FileOperationTypes, data: S3CommandOptions, options?: JobsOptions) {
		this.LOGGER.log({ job: data }, `Producing job ${type}`);
		await this.fileProcessingQueue.add(type, data, options);
	}
}
