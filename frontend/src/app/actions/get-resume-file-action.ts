"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { getFileByResumeId } from "@/services/file-upload/get-file-by-resume-id";

export async function getResumeFileAction(resumeId: string) {
	const result = await getFileByResumeId(resumeId);
	if (isCustomError(result)) return ActionResponse.error(result);

	return ActionResponse.success(result, "File retrieved successfully");
}
