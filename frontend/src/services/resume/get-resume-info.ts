import FetchClient from '@/lib/fetch';
import { ResumeInfo } from '@/types/resume-info';

export const getResumeInfo = async (resumeId: string) => {
	return FetchClient.get<ResumeInfo>(`/resume/${resumeId}/info`);
};
