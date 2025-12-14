"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { GenerateResumeFromPromptRequest, generateResumeFromPrompt, GenerateResumeFromPromptSchema } from "@/services/resume/generate-resume-from-prompt";

export async function generateResumeFromPromptAction(payload: GenerateResumeFromPromptRequest) {
	const validation = GenerateResumeFromPromptSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await generateResumeFromPrompt(validation.data);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Resume created successfully");
}
