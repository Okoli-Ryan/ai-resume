"use server";

import { ActionResponse, isCustomError } from "@/lib/utils";
import { updateCertificationList, UpdateCertificationListSchema } from "@/services/resume/update-certification-list";
import { CertificationDto } from "@/types/certification";

export async function updateCertificationListAction(certifications: CertificationDto[], resumeId: string) {
	const validation = UpdateCertificationListSchema.safeParse(certifications);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await updateCertificationList(validation.data, resumeId);
	if (isCustomError(response)) return ActionResponse.error(response);

	return ActionResponse.success(response, "Certifications updated successfully");
}
