"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { updateResumeInfo, UpdateResumeInfoSchema } from '@/services/resume/update-resume-info';
import { TResume } from '@/types/resume';

export async function updateResumeInfoAction(payload: Partial<TResume>, resumeId: string) {
	const validation = UpdateResumeInfoSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updateResumeInfo(payload, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume updated successfully");
}
