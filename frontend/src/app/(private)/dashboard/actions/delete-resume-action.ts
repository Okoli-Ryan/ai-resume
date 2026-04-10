"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { deleteResume } from '@/services/resume/delete-resume';

export async function deleteResumeAction(resumeId: string) {
	const response = await deleteResume(resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume deleted successfully");
}
