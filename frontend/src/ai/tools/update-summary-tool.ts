import { isCustomError } from "@/lib/utils";
import { patchUpdateSummary } from "@/services/resume/patch-update-summary";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse } from "@/ai/utils";

const updateSummarySchema = z.object({
	summary: z.string().optional().describe("The professional summary/objective"),
});

export const updateSummaryTool = (resumeId: string) =>
	tool({
		description:
			"Updates the resume summary/objective for a given resume ID. Use this tool to update only the professional summary or objective section of the resume.",
		inputSchema: updateSummarySchema,
		execute: async (updates) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				const response = await patchUpdateSummary(filteredUpdates, resumeId);

				if (isCustomError(response)) {
					throw new Error(`Failed to update resume summary: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update resume summary: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});