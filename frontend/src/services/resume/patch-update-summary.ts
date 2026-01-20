import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export const patchUpdateSummary = async (payload: { summary?: string }, resumeId: string) => {
	return FetchClient.patch<{ summary?: string }, TResume>(`/resume/${resumeId}/summary`, payload);
};
