"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { duplicateResume } from '@/services/resume/duplicate-resume';

export async function duplicateResumeAction(resumeId: string) {
	const response = await duplicateResume(resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
