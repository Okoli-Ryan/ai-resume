"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { getResumePDF } from "@/services/resume/get-resume-pdf";
import { uploadFile } from "@/services/file-upload/upload-file";

export async function uploadResumeFileAction(resumeId: string, filename: string) {
	const pdfResult = await getResumePDF(resumeId);
	if (isCustomError(pdfResult)) return ActionResponse.error(pdfResult);

	const file = new File([pdfResult as Blob], filename, { type: "application/pdf" });

	const uploadResult = await uploadFile(file, resumeId);
	if (isCustomError(uploadResult)) return ActionResponse.error(uploadResult);

	return ActionResponse.success(uploadResult, "File uploaded successfully");
}
