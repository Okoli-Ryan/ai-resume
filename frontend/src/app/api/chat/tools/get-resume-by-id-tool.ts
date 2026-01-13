import { isCustomError } from "@/lib/utils";
import { getResumeById } from "@/services/resume/get-resume-by-id";
import { tool } from "ai";
import z from "zod";

export const getResumeByIdTool = (resumeId: string) =>
	tool({
		description: "Fetches the resume data for a given resume ID.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getResumeById(resumeId);

				// Check if the response is an error
				if (isCustomError(response)) {
					throw new Error(`Failed to fetch resume: ${response.message}`);
				}

				return response;
			} catch (error) {
				throw new Error(`Unable to fetch resume data: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
