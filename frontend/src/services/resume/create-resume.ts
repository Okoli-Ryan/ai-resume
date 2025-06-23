import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export const createResume = async (payload: Partial<TResume>) => {
    return FetchClient.post<TResume, Partial<TResume>>(`/resume`, payload);
};
