import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { WorkExperienceDto } from '@/types/work-experience';

type UpdateWorkExperienceListRequest = z.infer<typeof UpdateWorkExperienceListSchema>;

export const updateWorkExperienceList = async (payload: UpdateWorkExperienceListRequest, resumeId: string) => {
	return FetchClient.put<UpdateWorkExperienceListRequest, WorkExperienceDto[]>(`/work-experience/resume/${resumeId}`, payload);
};

export const UpdateWorkExperienceListSchema = z.array(
	z.object({
		companyName: z.string().optional(),
		companyLink: z.string().nullable().optional(),
		title: z.string().optional(),
		location: z.string().nullable().optional(),
		startDate: z.string().optional(),
		workType: z.string().nullable().optional(),
		endDate: z.string().optional(),
		isOngoing: z.boolean().default(false),
		bulletPoints: z
			.array(
				z.object({
					text: z.string(),
					order: z.number().default(0),
					workExperienceId: z.string().optional(),
				})
			)
			.optional(),
	})
);
