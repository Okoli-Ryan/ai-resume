import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { EducationDto } from '@/types/education';

type UpdateEducationListRequest = z.infer<typeof UpdateEducationListSchema>;

export const updateEducationList = async (payload: UpdateEducationListRequest, resumeId: string) => {
	return FetchClient.put<UpdateEducationListRequest, EducationDto[]>(`/education/resume/${resumeId}`, payload);
};

export const UpdateEducationListSchema = z.array(
	z.object({
		schoolName: z.string().optional(),
		degree: z.string().optional(),
		fieldOfStudy: z.string().optional(),
		location: z.string().optional(),
		isOngoing: z.boolean(),
		startDate: z
			.string()
			.optional()
			.default(() => new Date().toISOString()),
		endDate: z
			.string()
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
