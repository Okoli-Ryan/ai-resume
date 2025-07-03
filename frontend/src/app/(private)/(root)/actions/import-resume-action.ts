"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { importResume } from "@/services/resume/import-resume";

export async function importResumeAction(payload: string) {
	const response = await importResume(payload);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
