import { isCustomError } from "@/lib/utils";
import { patchUpdateResumeInfo } from "@/services/resume/patch-update-resume";
import { tool } from "ai";
import z from "zod";
import { jsonToToon } from '@jojojoseph/toon-json-converter';

const updateResumeSchema = z.object({
	userName: z.string().optional().describe("The user's full name"),
	resumeName: z.string().optional().describe("The name/title of the resume"),
	email: z.string().email().optional().describe("The user's email address"),
	tags: z.string().optional().describe("Tags associated with the resume"),
	summary: z.string().optional().describe("The professional summary/objective"),
	role: z.string().optional().describe("The user's job title or role"),
	order: z.string().optional().describe("The order of resume sections"),
	address: z.string().optional().describe("The user's address"),
	phoneNumber: z.string().optional().describe("The user's phone number"),
	isFavourite: z.boolean().optional().describe("Whether the resume is marked as favourite"),
	linkedinUrl: z.string().optional().describe("LinkedIn profile URL"),
	githubUrl: z.string().optional().describe("GitHub profile URL"),
	portfolioUrl: z.string().optional().describe("Portfolio website URL"),
});

export const updateResumeTool = (resumeId: string) =>
	tool({
		description:
			"Updates the resume data for a given resume ID. Use this tool to update basic resume information like name, email, summary, role, contact info, and social links. Only include fields that need to be updated. IMPORTANT: Do NOT guess or assume any values - only include fields that the user has explicitly provided. Leave all other fields as undefined.",
		inputSchema: updateResumeSchema,
		execute: async (updates) => {
			try {
				// Filter out undefined values
				const filteredUpdates = Object.fromEntries(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					Object.entries(updates).filter(([_, value]) => value !== undefined)
				);

				if (Object.keys(filteredUpdates).length === 0) {
					return { success: false, message: "No fields provided to update" };
				}

				const response = await patchUpdateResumeInfo(filteredUpdates, resumeId);

				if (isCustomError(response)) {
					throw new Error(`Failed to update resume: ${response.message}`);
				}

				return jsonToToon({
					success: true,
					updatedFields: Object.keys(filteredUpdates),
				});
			} catch (error) {
				throw new Error(`Unable to update resume: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
