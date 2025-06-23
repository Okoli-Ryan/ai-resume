"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import {
	updateEducationList, UpdateEducationListSchema
} from '@/services/resume/update-education-list';
import { TResume } from '@/types/resume';

export async function updateEducationListAction(payload: TResume["education"], resumeId: string) {
	const validation = UpdateEducationListSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updateEducationList(validation.data, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
