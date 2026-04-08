import FetchClient from "@/lib/fetch";
import { FileUploadDto } from "./upload-file";

export const getFileByResumeId = async (resumeId: string) => {
	return FetchClient.get<FileUploadDto>(`/file-upload/resume/${resumeId}`, { hasCustomResponse: true });
};
