"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { updateSkillsList, UpdateSkillsListSchema } from '@/services/resume/update-skills-list';
import { TResume } from '@/types/resume';

export async function updateSkillsListAction(payload: TResume["skills"], resumeId: string) {
	const validation = UpdateSkillsListSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updateSkillsList(validation.data, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
