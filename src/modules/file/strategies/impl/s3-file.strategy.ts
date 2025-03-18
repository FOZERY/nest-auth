import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RemoveFileDTO } from "../../dto/remove-file.dto";
import { FileUploadResult, UploadedFileDTO } from "../../dto/upload-file.dto";
import { FileUploadStrategy } from "../file.strategy";
import { S3_CLIENT } from "../../../../external/s3/constants/s3.constants";

export interface FileUploadOptions {
	bucket: string;
	path: string;
}

@Injectable()
export class S3FileUploadStrategy implements FileUploadStrategy {
	constructor(
		@Inject(S3_CLIENT) private readonly s3: S3Client,
		private readonly configService: ConfigService
	) {}

	public async uploadPublicFile(dto: UploadedFileDTO): Promise<FileUploadResult> {
		if (!dto.bucket) {
			throw new Error("Bucket is required");
		}

		const command = new PutObjectCommand({
			Bucket: dto.bucket,
			Body: dto.file.buffer,
			Key: dto.path,
			ContentType: dto.file.mimetype,
			ACL: "public-read",
		});

		await this.s3.send(command);

		return {
			path: dto.path,
			url: `${this.configService.get<string>("S3_URL")}/${dto.bucket}/${dto.path}`,
		};
	}

	public async removeFile(dto: RemoveFileDTO): Promise<void> {
		if (!dto.bucket) {
			throw new Error("Bucket is required");
		}

		const command = new DeleteObjectCommand({
			Bucket: dto.bucket,
			Key: dto.path,
		});

		await this.s3.send(command);
	}
}
