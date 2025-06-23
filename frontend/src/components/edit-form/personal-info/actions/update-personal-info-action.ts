"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import {
	updatePersonalInfo, UpdatePersonalInfoSchema
} from '@/services/resume/update-personal-info';
import { TResume } from '@/types/resume';

export async function updatePersonalInfoAction(payload: Partial<TResume>, resumeId: string) {
	const validation = UpdatePersonalInfoSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updatePersonalInfo(payload, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
