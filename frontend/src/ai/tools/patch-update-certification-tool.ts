import { isCustomError } from "@/lib/utils";
import { patchUpdateCertification } from "@/services/certification/patch-update-certification";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse } from "@/ai/utils";

const patchUpdateCertificationSchema = z.object({
	certificationId: z.string().describe("The ID of the certification to update"),
	certificationName: z.string().optional().describe("The name of the certification"),
	certificateLink: z.string().optional().describe("Link to the certificate"),
	dateAttained: z.string().optional().describe("Date when the certification was attained (ISO format)"),
});

export const patchUpdateCertificationTool = () =>
	tool({
		description:
			"Partially updates a certification by its ID. Use this tool to update specific fields of a certification without affecting other fields. Only include fields that need to be updated. IMPORTANT: Do NOT guess or assume any values - only include fields that the user has explicitly provided.",
		inputSchema: patchUpdateCertificationSchema,
		execute: async ({ certificationId, ...updates }) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				const response = await patchUpdateCertification(certificationId, filteredUpdates);

				if (isCustomError(response)) {
					throw new Error(`Failed to update certification: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update certification: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
