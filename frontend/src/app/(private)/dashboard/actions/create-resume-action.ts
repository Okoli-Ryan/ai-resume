"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { createResume } from '@/services/resume/create-resume';
import { TResume } from '@/types/resume';

export async function createResumeAction(payload: Partial<TResume>) {
	const response = await createResume(payload);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
