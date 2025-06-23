import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export const duplicateResume = async (resumeId: string) => {
    return FetchClient.post<Partial<TResume>, null>(`/resume/duplicate/${resumeId}`, null);
};
