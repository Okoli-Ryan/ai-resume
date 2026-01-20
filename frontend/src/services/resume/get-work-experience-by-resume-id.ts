import FetchClient from '@/lib/fetch';
import { WorkExperienceDto } from '@/types/work-experience';

export const getWorkExperienceByResumeId = async (resumeId: string) => {
	return FetchClient.get<WorkExperienceDto[]>(`/work-experience/resume/${resumeId}`);
};
