"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { updateResumeStatus } from '@/services/resume/update-resume-status';

export async function updateResumeStatusAction(resumeId: string, status: string) {
	const response = await updateResumeStatus(resumeId, status);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, `Resume ${status === 'Draft' ? 'saved as draft' : 'published'}`);
}
