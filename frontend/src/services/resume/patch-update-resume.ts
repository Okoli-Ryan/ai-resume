import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export const patchUpdateResumeInfo = async (payload: Partial<TResume>, resumeId: string) => {
	return FetchClient.patch<Partial<TResume>, TResume>(`/resume/${resumeId}`, payload);
};
