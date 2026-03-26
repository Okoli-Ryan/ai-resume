import { isCustomError } from "@/lib/utils";
import { patchUpdateWorkExperience } from "@/services/work-experience/patch-update-work-experience";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse } from "@/ai/utils";

const patchUpdateWorkExperienceSchema = z.object({
	workExperienceId: z.string().describe("The ID of the work experience to update"),
	companyName: z.string().optional().describe("The name of the company"),
	companyLink: z.string().optional().describe("Link to the company website"),
	title: z.string().optional().describe("Job title or position"),
	workType: z.string().optional().describe("Type of work (e.g., Full-time, Part-time, Contract)"),
	startDate: z.string().optional().describe("Start date of the position (ISO format)"),
	endDate: z.string().optional().describe("End date of the position (ISO format, null if ongoing)").nullable(),
	location: z.string().optional().describe("Location of the work"),
});

export const patchUpdateWorkExperienceTool = () =>
	tool({
		description:
			"Partially updates a work experience entry by its ID. Use this tool to update specific fields of a work experience entry without affecting other fields. Only include fields that need to be updated. IMPORTANT: Do NOT guess or assume any values - only include fields that the user has explicitly provided.",
		inputSchema: patchUpdateWorkExperienceSchema,
		execute: async ({ workExperienceId, ...updates }) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				const response = await patchUpdateWorkExperience(workExperienceId, filteredUpdates);

				if (isCustomError(response)) {
					throw new Error(`Failed to update work experience: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update work experience: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
