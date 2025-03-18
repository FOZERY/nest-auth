import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3_CLIENT } from "../../../../external/s3/s3.module";
import { UploadedFileDTO } from "../../dto/upload-file.dto";
import { FileService, FileUploadResult } from "../../services/file.service";

export interface FileUploadOptions {
	bucket: string;
	path: string;
}

@Injectable()
export class S3FileService extends FileService {
	constructor(
		@Inject(S3_CLIENT) private readonly s3: S3Client,
		private readonly configService: ConfigService
	) {
		super();
	}

	public async uploadPublicFile(file: UploadedFileDTO): Promise<FileUploadResult> {
		if (!file.bucket) {
			throw new Error("Bucket is required");
		}

		const path = `${file.folder}/${file.name}`;

		const command = new PutObjectCommand({
			Bucket: file.bucket,
			Body: file.file.buffer,
			Key: path,
			ContentType: file.file.mimetype,
			ACL: "public-read",
		});

		const result = await this.s3.send(command);
		console.log(result);

		return {
			path,
			url: `${this.configService.get<string>("S3_URL")}/${file.bucket}/${path}`,
		};
	}

	removeFile(path: string, bucket: string): Promise<void> {
		throw new Error(`Method not implemented. ${path} ${bucket}`);
	}
}
