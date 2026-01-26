import { isCustomError } from "@/lib/utils";
import { patchUpdateEducation } from "@/services/education/patch-update-education";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse } from "@/ai/utils";

const patchUpdateEducationSchema = z.object({
	educationId: z.string().describe("The ID of the education entry to update"),
	schoolName: z.string().optional().describe("The name of the school or institution"),
	degree: z.string().optional().describe("The degree obtained or pursued"),
	fieldOfStudy: z.string().optional().describe("The field of study or major"),
	location: z.string().optional().describe("The location of the school"),
	isOngoing: z.boolean().optional().describe("Whether the education is currently ongoing"),
	startDate: z.string().optional().describe("Start date of the education (ISO format)"),
	endDate: z.string().optional().describe("End date of the education (ISO format, null if ongoing)"),
});

export const patchUpdateEducationTool = () =>
	tool({
		description:
			"Partially updates an education entry by its ID. Use this tool to update specific fields of an education entry without affecting other fields. Only include fields that need to be updated. IMPORTANT: Do NOT guess or assume any values - only include fields that the user has explicitly provided.",
		inputSchema: patchUpdateEducationSchema,
		execute: async ({ educationId, ...updates }) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				const response = await patchUpdateEducation(educationId, filteredUpdates);

				if (isCustomError(response)) {
					throw new Error(`Failed to update education: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update education: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
