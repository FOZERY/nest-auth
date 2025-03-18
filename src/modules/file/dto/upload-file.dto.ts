export interface FilePayload {
	fieldname: string;
	originalname: string;
	mimetype?: string;
	buffer: Buffer;
	size?: number;
}

export interface UploadedFileDTO {
	file: FilePayload;
	path: string;
	bucket?: string;
}

export interface FileUploadResult {
	path: string;
	bucket?: string;
	url?: string;
}
