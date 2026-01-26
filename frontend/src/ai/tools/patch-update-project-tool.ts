import { isCustomError } from "@/lib/utils";
import { patchUpdateProject } from "@/services/project/patch-update-project";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse } from "@/ai/utils";

const patchUpdateProjectSchema = z.object({
	projectId: z.string().describe("The ID of the project to update"),
	projectName: z.string().optional().describe("The name of the project"),
	projectUrl: z.string().optional().describe("URL link to the project"),
});

export const patchUpdateProjectTool = () =>
	tool({
		description:
			"Partially updates a project by its ID. Use this tool to update specific fields of a project without affecting other fields. Only include fields that need to be updated. IMPORTANT: Do NOT guess or assume any values - only include fields that the user has explicitly provided.",
		inputSchema: patchUpdateProjectSchema,
		execute: async ({ projectId, ...updates }) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				const response = await patchUpdateProject(projectId, filteredUpdates);

				if (isCustomError(response)) {
					throw new Error(`Failed to update project: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update project: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
