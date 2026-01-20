import { isCustomError } from "@/lib/utils";
import { getResumeInfo } from "@/services/resume/get-resume-info";
import { JsonObject, jsonToToon } from "@jojojoseph/toon-json-converter";
import { tool } from "ai";
import z from "zod";

export const getResumeInfoTool = (resumeId: string) =>
	tool({
		description: "Fetches the resume info (general metadata) for a given resume ID. This does not include sections like work experience, education, projects, skills, or certifications.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getResumeInfo(resumeId);

				// Check if the response is an error
				if (isCustomError(response)) {
					throw new Error(`Failed to fetch resume info: ${response.message}`);
				}

				return jsonToToon(response as JsonObject);
			} catch (error) {
				throw new Error(`Unable to fetch resume info: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
