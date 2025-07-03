import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export const importResume = async (payload: string) => {
	return FetchClient.post<TResume, { base64String: string }>(`/resume/import`, { base64String: payload });
};
