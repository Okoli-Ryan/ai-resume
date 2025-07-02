"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { enhanceBulletpointList, EnhanceBulletPointListRequest, EnhanceBulletPointListSchema } from "@/services/bullet-points/enhance-bullet-points";
import { EnhanceTypes } from "@/types/common";

export async function enhanceBulletpointListAction(payload: EnhanceBulletPointListRequest, enhanceType: EnhanceTypes) {
	const validation = EnhanceBulletPointListSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await enhanceBulletpointList(validation.data, enhanceType);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response);
}
