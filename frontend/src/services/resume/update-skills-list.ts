import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { SkillDto } from '@/types/skill';

export type UpdateSkillsListRequest = z.infer<typeof UpdateSkillsListSchema>;

export const updateSkillsList = async (payload: UpdateSkillsListRequest, resumeId: string) => {
	return FetchClient.put<UpdateSkillsListRequest, SkillDto[]>(`/skill/resume/${resumeId}`, payload);
};

export const UpdateSkillsListSchema = z.array(
	z.object({
		category: z.string(),
		skills: z.string(),
		resumeId: z.string(),
	})
);
