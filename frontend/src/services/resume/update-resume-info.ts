import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export const updateResumeInfo = async (payload: Partial<TResume>, resumeId: string) => {
	return FetchClient.put<Partial<TResume>, TResume>(`/resume/${resumeId}`, payload);
};

export const UpdateResumeInfoSchema = z
	.object({
		resumeName: z.string().nullable().optional(),
		tags: z.string().nullable().optional(),
	})
	.optional();
