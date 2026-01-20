import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export const patchUpdateLinks = async (payload: { linkedinUrl?: string; githubUrl?: string; portfolioUrl?: string }, resumeId: string) => {
	return FetchClient.patch<{ linkedinUrl?: string; githubUrl?: string; portfolioUrl?: string }, TResume>(`/resume/${resumeId}/links`, payload);
};
