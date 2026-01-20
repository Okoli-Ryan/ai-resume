import { isCustomError } from "@/lib/utils";
import { getWorkExperienceByResumeId } from "@/services/resume/get-work-experience-by-resume-id";
import { JsonObject, jsonToToon } from "@jojojoseph/toon-json-converter";
import { tool } from "ai";
import z from "zod";

export const getWorkExperienceTool = (resumeId: string) =>
	tool({
		description: "Fetches the work experience data for a given resume ID.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getWorkExperienceByResumeId(resumeId);

				// Check if the response is an error
				if (isCustomError(response)) {
					throw new Error(`Failed to fetch work experience: ${response.message}`);
				}

				return jsonToToon(response as unknown as JsonObject);
			} catch (error) {
				throw new Error(`Unable to fetch work experience data: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
