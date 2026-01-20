import { isCustomError } from "@/lib/utils";
import { patchUpdateLinks } from "@/services/resume/patch-update-links";
import { tool } from "ai";
import z from "zod";
import { filterUpdates, checkForUpdates, createUpdateSuccessResponse } from "@/ai/utils";

const updateLinksSchema = z.object({
	linkedinUrl: z.string().optional().describe("LinkedIn profile URL"),
	githubUrl: z.string().optional().describe("GitHub profile URL"),
	portfolioUrl: z.string().optional().describe("Portfolio website URL"),
});

export const updateLinksTool = (resumeId: string) =>
	tool({
		description:
			"Updates the resume social links (LinkedIn, GitHub, Portfolio) for a given resume ID. Use this tool to update only the social media and portfolio links of the resume.",
		inputSchema: updateLinksSchema,
		execute: async (updates) => {
			try {
				const filteredUpdates = filterUpdates(updates);
				
				const earlyReturn = checkForUpdates(filteredUpdates);
				if (earlyReturn) return earlyReturn;

				const response = await patchUpdateLinks(filteredUpdates, resumeId);

				if (isCustomError(response)) {
					throw new Error(`Failed to update resume links: ${response.message}`);
				}

				return createUpdateSuccessResponse(filteredUpdates);
			} catch (error) {
				throw new Error(`Unable to update resume links: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});