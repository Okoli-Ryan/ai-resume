import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export const getResumesByUserId = async (userId: string) => {
    return FetchClient.get<TResume[]>(`/resume/user/${userId}`);
};
