import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { S3Module } from "../../external/s3/s3.module";
import { FileModuleQueues } from "./file.constants";
import { FileProcessingQueueConsumer } from "./queue/file-processing.consumer";
import { FileProcessingQueueProducer } from "./queue/file-processing.producer";

@Module({
	imports: [
		S3Module.forFeature(),
		BullModule.registerQueue({
			name: FileModuleQueues.FileProcessing,
		}),
	],
	providers: [FileProcessingQueueConsumer, FileProcessingQueueProducer],
	exports: [FileProcessingQueueProducer],
})
export class FileModule {}
