import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { EnhanceTypes } from '@/types/common';

export type EnhanceBulletPointListRequest = z.infer<typeof EnhanceBulletPointListSchema>;

export const enhanceBulletpointList = async (payload: EnhanceBulletPointListRequest, enhanceType: EnhanceTypes) => {
	return FetchClient.post<string[], EnhanceBulletPointListRequest>(`/bullet-point/enhance-list/${enhanceType}`, payload);
};

export const EnhanceBulletPointListSchema = z.object({
	bulletPoints: z.array(z.string().min(1, { message: "All bullet points must have a value" })),
	additionalInfo: z
		.object({
			jobDescription: z.string().optional(),
			role: z.string().optional(),
			tags: z.string().optional(),
		})
		.optional(),
});
