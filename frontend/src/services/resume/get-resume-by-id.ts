import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export const getResumeById = async (id: string) => {
	return FetchClient.get<TResume>(`/resume/${id}`);
};
