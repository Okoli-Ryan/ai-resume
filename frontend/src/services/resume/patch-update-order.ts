import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export const patchUpdateOrder = async (payload: { order?: string }, resumeId: string) => {
	return FetchClient.patch<{ order?: string }, TResume>(`/resume/${resumeId}/order`, payload);
};
