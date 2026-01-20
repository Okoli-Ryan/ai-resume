import { isCustomError } from "@/lib/utils";
import { patchUpdateResumeInfo } from "@/services/resume/patch-update-resume-info";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse } from "@/ai/utils";

const updateResumeInfoSchema = z.object({
	userName: z.string().optional().describe("The user's full name"),
	resumeName: z.string().optional().describe("The name/title of the resume"),
	email: z.string().email().optional().describe("The user's email address"),
	tags: z.string().optional().describe("Tags associated with the resume"),
	role: z.string().optional().describe("The user's job title or role"),
	address: z.string().optional().describe("The user's address"),
	phoneNumber: z.string().optional().describe("The user's phone number"),
});

export const updateResumeInfoTool = (resumeId: string) =>
	tool({
		description:
			"Updates the basic resume information for a given resume ID. Use this tool to update basic resume information like name, email, role, contact info, and tags. Only include fields that need to be updated. IMPORTANT: Do NOT guess or assume any values - only include fields that the user has explicitly provided.",
		inputSchema: updateResumeInfoSchema,
		execute: async (updates) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				const response = await patchUpdateResumeInfo(filteredUpdates, resumeId);

				if (isCustomError(response)) {
					throw new Error(`Failed to update resume info: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update resume info: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});