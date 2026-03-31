import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { CertificationDto } from '@/types/certification';

type UpdateCertificationListRequest = z.infer<typeof UpdateCertificationListSchema>;

export const updateCertificationList = async (payload: UpdateCertificationListRequest, resumeId: string) => {
	return FetchClient.put<UpdateCertificationListRequest, CertificationDto[]>(`/certification/resume/${resumeId}`, payload);
};

export const UpdateCertificationListSchema = z.array(
	z.object({
		certificationName: z.string().nullable().optional(),
		certificateLink: z.string().nullable().optional(),
		dateAttained: z.string().nullable().optional(),
		resumeId: z.string(),
		bulletPoints: z
			.array(
				z.object({
					text: z.string(),
					order: z.number().default(0),
					certificationId: z.string().optional(),
				}),
			)
			.optional(),
	}),
);
