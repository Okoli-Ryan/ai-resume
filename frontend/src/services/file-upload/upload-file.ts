import FetchClient from "@/lib/fetch";
import { BaseEntity } from "@/types/common";

export type FileUploadDto = BaseEntity & {
	resumeId?: string;
	coverLetterId?: string;
	version: number;
	shortenedUrl: string;
	url: string;
	fileKey: string;
	userId: string;
};

export const uploadFile = async (file: File, resumeId: string) => {
	return FetchClient.post<FileUploadDto, { file: File; resumeId: string }>(
		"/file-upload/upload",
		{ file, resumeId },
		{ isFormdata: true, hasCustomResponse: true }
	);
};
