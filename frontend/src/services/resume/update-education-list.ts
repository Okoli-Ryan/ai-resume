import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { EducationDto } from '@/types/education';

type UpdateEducationListRequest = z.infer<typeof UpdateEducationListSchema>;

export const updateEducationList = async (payload: UpdateEducationListRequest, resumeId: string) => {
	return FetchClient.put<UpdateEducationListRequest, EducationDto[]>(`/education/resume/${resumeId}`, payload);
};

export const UpdateEducationListSchema = z.array(
	z.object({
		schoolName: z.string().nullable().optional(),
		degree: z.string().nullable().optional(),
		fieldOfStudy: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		isOngoing: z.boolean(),
		startDate: z
			.string().nullable()
			.optional()
			.default(() => new Date().toISOString()),
		endDate: z
			.string().nullable()
			.optional()
			.default(() => new Date().toISOString()),
		resumeId: z.string(),
		bulletPoints: z
			.array(
				z.object({
					text: z.string(),
					order: z.number().default(0),
					educationId: z.string().optional(),
				})
			)
			.optional(),
	})
);
