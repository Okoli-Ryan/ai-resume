import FetchClient from '@/lib/fetch';
import { ProjectDto } from '@/types/project';

export const getProjectsByResumeId = async (resumeId: string) => {
	return FetchClient.get<ProjectDto[]>(`/project/resume/${resumeId}`);
};
