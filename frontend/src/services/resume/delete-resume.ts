import FetchClient from '@/lib/fetch';

export const deleteResume = async (resumeId: string) => {
    return FetchClient.delete<boolean>(`/resume/${resumeId}`);
};
