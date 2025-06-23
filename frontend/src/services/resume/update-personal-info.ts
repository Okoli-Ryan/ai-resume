import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { urlValidation } from '@/lib/utils';
import { TResume } from '@/types/resume';

export const updatePersonalInfo = async (payload: Partial<TResume>, resumeId: string) => {
	return FetchClient.put<Partial<TResume>, TResume>(`/resume/${resumeId}`, payload);
};

export const UpdatePersonalInfoSchema = z
	.object({
		userName: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		summary: z.string().nullable(),
		role: z.string().nullable(),
		address: z.string().nullable().optional(),
		phoneNumber: z.string().optional(),
		linkedinUrl: urlValidation("LinkedIn URL is invalid"),
		githubUrl: urlValidation("Github URL is invalid"),
		portfolioUrl: urlValidation("Portfolio URL is invalid"),
	})
	.optional();
