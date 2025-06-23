"use server";

import { ActionResponse, isCustomError } from '@/lib/utils';
import { updateProjectList, UpdateProjectListSchema } from '@/services/resume/update-project-list';
import { TResume } from '@/types/resume';

export async function updateProjectListAction(payload: TResume["projects"], resumeId: string) {
	const validation = UpdateProjectListSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updateProjectList(validation.data, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
