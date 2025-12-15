import { z } from 'zod';

import FetchClient from '@/lib/fetch';
import { LinkDto } from '@/types/link';

export type UpdateLinksRequest = z.infer<typeof UpdateLinksSchema>;

export const updateLinks = async (resumeId: string, payload: UpdateLinksRequest) => {
	return FetchClient.put<UpdateLinksRequest, LinkDto[] >(`/link/resume/${resumeId}`, payload);
};

export const UpdateLinksSchema = z.array(
	z.object({
		linkName: z.string().min(1, { message: "Link name is required" }),
		url: z.string().url({ message: "Must be a valid URL" }),
		index: z.number(),
	})
);
