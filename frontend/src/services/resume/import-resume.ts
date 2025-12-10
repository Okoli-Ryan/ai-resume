import { z } from "zod";

import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export type ImportResumeRequest = z.infer<typeof ImportResumeSchema>;

export const importResume = async (payload: ImportResumeRequest) => {
	return FetchClient.post<TResume, ImportResumeRequest>(`/resume/import`, payload);
};

export const ImportResumeSchema = z.object({
	base64String: z.string(),
	additionalInfo: z
		.object({
			jobDescription: z.string().optional(),
			role: z.string().optional(),
			tags: z.string().optional(),
		})
		.optional(),
});
