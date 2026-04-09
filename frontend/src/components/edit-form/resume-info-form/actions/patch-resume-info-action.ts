"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { patchUpdateResumeInfo } from '@/services/resume/patch-update-resume-info';
import { TResume } from '@/types/resume';

export async function patchResumeInfoAction(payload: Partial<TResume>, resumeId: string) {
	const response = await patchUpdateResumeInfo(payload, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume updated successfully");
}
