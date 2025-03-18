import { S3Client } from "@aws-sdk/client-s3";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3_CLIENT } from "./constants/s3.constants";

@Module({
	imports: [],
	providers: [
		{
			provide: S3_CLIENT,
			useFactory: (configService: ConfigService) => {
				return new S3Client({
					endpoint: configService.get<string>("S3_URL")!,
					region: configService.get<string>("S3_REGION")!,
					credentials: {
						accessKeyId: configService.get<string>("S3_ACCESS_KEY_ID")!,
						secretAccessKey: configService.get<string>("S3_SECRET_ACCESS_KEY")!,
					},
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [S3_CLIENT],
})
export class S3Module {}
