import { isCustomError } from "@/lib/utils";
import { patchUpdateOrder } from "@/services/resume/patch-update-order";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse, validateResumeOrder } from "@/ai/utils";

const updateOrderSchema = z.object({
	order: z.string().optional().describe("The order of resume sections as comma-separated values (summary, workExperience, education, certifications, projects, skills)"),
});

export const updateOrderTool = (resumeId: string) =>
	tool({
		description:
			"Updates the resume section order for a given resume ID. Use this tool to change the order of resume sections. The order should be comma-separated values from: summary, workExperience, education, certifications, projects, skills.",
		inputSchema: updateOrderSchema,
		execute: async (updates) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				// Validate order if provided
				if (filteredUpdates.order && !validateResumeOrder(filteredUpdates.order)) {
					throw new Error("Invalid order format. Order must contain comma-separated values from: summary, workExperience, education, certifications, projects, skills");
				}

				const response = await patchUpdateOrder(filteredUpdates, resumeId);

				if (isCustomError(response)) {
					throw new Error(`Failed to update resume order: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update resume order: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});