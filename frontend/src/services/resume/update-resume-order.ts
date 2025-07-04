import { z } from "zod";

import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export const updateResumeOrder = async (payload: Partial<TResume>, resumeId: string) => {
	return FetchClient.put<Partial<TResume>, TResume>(`/resume/${resumeId}`, payload);
};

export const UpdateResumeOrderSchema = z
	.object({
		order: z.string().optional(),
	})
	.optional();
