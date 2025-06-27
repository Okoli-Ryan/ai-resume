import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export const getMinimalResumesByUserId = async (userId: string) => {
    return FetchClient.get<Partial<TResume>[]>(`/resume/${userId}/minimal`);
};
