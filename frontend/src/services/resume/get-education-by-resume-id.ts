import FetchClient from '@/lib/fetch';
import { EducationDto } from '@/types/education';

export const getEducationByResumeId = async (resumeId: string) => {
	return FetchClient.get<EducationDto[]>(`/education/resume/${resumeId}`);
};
