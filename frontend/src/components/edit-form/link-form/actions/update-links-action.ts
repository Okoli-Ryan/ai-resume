"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { updateLinks, UpdateLinksSchema } from "@/services/links/update-links";
import { LinkDto } from "@/types/link";

export async function updateLinksAction(resumeId: string, payload: LinkDto[]) {
	// Transform LinkDto to UpdateLinksRequest format
	const transformedPayload = payload.map(link => ({
		linkName: link.name,
		url: link.url,
		index: link.index,
	}));

	const validation = UpdateLinksSchema.safeParse(transformedPayload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updateLinks(resumeId, validation.data);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response);
}
