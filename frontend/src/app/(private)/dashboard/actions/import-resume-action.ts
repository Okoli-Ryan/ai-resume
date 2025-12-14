"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { ImportResumeRequest, importResume, ImportResumeSchema } from "@/services/resume/import-resume";

export async function importResumeAction(payload: ImportResumeRequest) {
	const validation = ImportResumeSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await importResume(validation.data);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
