import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export const updateResumeStatus = async (resumeId: string, status: string) => {
	return FetchClient.patch<{ status: string }, Partial<TResume>>(`/resume/${resumeId}/status`, { status });
};
