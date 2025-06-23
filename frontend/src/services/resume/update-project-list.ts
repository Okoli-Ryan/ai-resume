import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { ProjectDto } from '@/types/project';

type UpdateProjectListRequest = z.infer<typeof UpdateProjectListSchema>;

export const updateProjectList = async (payload: UpdateProjectListRequest, resumeId: string) => {
	return FetchClient.put<UpdateProjectListRequest, ProjectDto[]>(`/project/resume/${resumeId}`, payload);
};

export const UpdateProjectListSchema = z.array(
	z.object({
		name: z.string().optional(),
		link: z.string().optional(),
		resumeId: z.string(),
		bulletPoints: z
			.array(
				z.object({
					text: z.string(),
					order: z.number().default(0),
					projectId: z.string().optional(),
				})
			)
			.optional(),
	})
);
