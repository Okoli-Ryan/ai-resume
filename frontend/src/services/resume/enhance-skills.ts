import { z } from "zod";

import FetchClient from "@/lib/fetch";

export type EnhanceSkillsRequest = z.infer<typeof EnhanceSkillsSchema>;

export const enhanceSkills = async (payload: EnhanceSkillsRequest) => {
	return FetchClient.post<{ category: string; skills: string[] }[], EnhanceSkillsRequest>(`/resume/enhance/skills`, payload);
};

export const EnhanceSkillsSchema = z.object({
	skills: z.array(z.string()),
	additionalInfo: z
		.object({
			jobDescription: z.string().optional(),
			role: z.string().optional(),
			tags: z.string().optional(),
		})
		.optional(),
});
