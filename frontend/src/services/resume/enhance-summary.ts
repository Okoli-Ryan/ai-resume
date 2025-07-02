import { z } from "zod";

import FetchClient from "@/lib/fetch";

export type EnhanceSummaryRequest = z.infer<typeof EnhanceSummarySchema>;

export const enhanceSummary = async (payload: EnhanceSummaryRequest) => {
	return FetchClient.post<{ summary: string }, EnhanceSummaryRequest>(`/resume/enhance/summary`, payload);
};

export const EnhanceSummarySchema = z.object({
	summary: z.string().nullable().optional(),
	additionalInfo: z
		.object({
			jobDescription: z.string().optional(),
			role: z.string().optional(),
			tags: z.string().optional(),
		})
		.optional(),
});
