import FetchClient from '@/lib/fetch';
import { SkillDto } from '@/types/skill';

export const getSkillsByResumeId = async (resumeId: string) => {
	return FetchClient.get<SkillDto[]>(`/skill/resume/${resumeId}`);
};
