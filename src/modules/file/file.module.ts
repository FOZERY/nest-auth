import { Module } from "@nestjs/common";
import { S3Module } from "../../external/s3/s3.module";
import { S3FileUploadStrategy } from "./strategies/impl/s3-file.strategy";

@Module({
	imports: [S3Module],
	providers: [S3FileUploadStrategy],
	exports: [S3FileUploadStrategy],
})
export class FilesModule {}
