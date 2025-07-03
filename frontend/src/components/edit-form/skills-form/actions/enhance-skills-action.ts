"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { enhanceSkills, EnhanceSkillsRequest, EnhanceSkillsSchema } from "@/services/resume/enhance-skills";

export async function enhanceSkillsAction(payload: EnhanceSkillsRequest) {
	const validation = EnhanceSkillsSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await enhanceSkills(validation.data);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response);
}
