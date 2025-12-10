"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { getResumePDF } from "@/services/resume/get-resume-pdf";

export async function getResumePDFAction(resumeId: string) {
	const response = await getResumePDF(resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "PDF fetched successfully");
}
