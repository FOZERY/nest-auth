import {
	DeleteObjectCommand,
	DeleteObjectCommandInput,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class S3Service {
	private readonly s3Client: S3Client;
	private readonly clientBaseURL: string;
	private readonly defaultBucket?: string;

	constructor(clientProvider: any) {
		this.s3Client = clientProvider.client.client;
		this.clientBaseURL = clientProvider.client.endpoint;
		this.defaultBucket = clientProvider.bucket;
	}

	private validateBucket(bucket?: string): string {
		if (this.defaultBucket && bucket) {
			throw new Error("Cannot specify bucket when default bucket is set");
		}

		if (!bucket && !this.defaultBucket) {
			throw new Error("Bucket is required");
		}

		return bucket || this.defaultBucket!;
	}

	public getBucket(): string {
		return this.validateBucket();
	}

	public getFileUrl(path: string, bucket?: string): string {
		const validatedBucket = this.validateBucket(bucket);
		return `${this.clientBaseURL}/${validatedBucket}/${path}`;
	}

	async uploadFile(
		options: Omit<PutObjectCommandInput, "Bucket"> & { Bucket?: string }
	): Promise<{
		url: string;
	}> {
		if (!options.Key || (options.Key && options.Key.trim().length === 0)) {
			throw new Error("Key can't be empty");
		}

		const validatedBucket = this.validateBucket(options.Bucket);

		await this.s3Client.send(
			new PutObjectCommand({
				...options,
				Bucket: validatedBucket,
			})
		);

		return {
			url: this.getFileUrl(options.Key, validatedBucket),
		};
	}

	async deleteFile(
		options: Omit<DeleteObjectCommandInput, "Bucket"> & { Bucket?: string }
	): Promise<void> {
		if (!options.Key) return;

		const validatedBucket = this.validateBucket(options.Bucket);

		await this.s3Client.send(
			new DeleteObjectCommand({
				Bucket: validatedBucket,
				Key: options.Key,
			})
		);
	}
}
