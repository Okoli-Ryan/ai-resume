"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import {
	updateWorkExperienceList, UpdateWorkExperienceListSchema
} from '@/services/resume/update-work-experience-list';
import { TResume } from '@/types/resume';

export async function updateWorkExperienceListAction(payload: TResume["workExperience"], resumeId: string) {
	const validation = UpdateWorkExperienceListSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updateWorkExperienceList(validation.data, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
