"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { enhanceSummary, EnhanceSummaryRequest, EnhanceSummarySchema } from "@/services/resume/enhance-summary";

export async function enhanceSummaryAction(payload: EnhanceSummaryRequest) {
	const validation = EnhanceSummarySchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await enhanceSummary(validation.data);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response);
}
