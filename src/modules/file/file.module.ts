import { Module } from "@nestjs/common";
import { S3Module } from "../../external/s3/s3.module";
import { S3FileService } from "./external/s3/s3-file.service";

@Module({
	imports: [S3Module],
	providers: [S3FileService],
	exports: [S3FileService],
})
export class FilesModule {}
