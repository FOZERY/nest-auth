import { randomUUID } from "crypto";
import { UploadedFileDTO } from "../dto/upload-file.dto";

export interface FileUploadResult {
	path: string;
	url?: string;
}

export abstract class FileService {
	abstract uploadPublicFile(file: UploadedFileDTO): Promise<FileUploadResult>;
	abstract removeFile(path: string, bucket: string): Promise<void>;
	public static generateUniqueFileName(): string {
		return `${Date.now()}-${randomUUID()}`;
	}
}
