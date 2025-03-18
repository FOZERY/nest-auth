import { RemoveFileDTO } from "../dto/remove-file.dto";
import { FileUploadResult, UploadedFileDTO } from "../dto/upload-file.dto";

export interface FileUploadStrategy {
	uploadPublicFile(dto: UploadedFileDTO): Promise<FileUploadResult>;
	removeFile(dto: RemoveFileDTO): Promise<void>;
}
