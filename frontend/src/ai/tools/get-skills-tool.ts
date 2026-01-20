import { isCustomError } from "@/lib/utils";
import { getSkillsByResumeId } from "@/services/resume/get-skills-by-resume-id";
import { JsonObject, jsonToToon } from "@jojojoseph/toon-json-converter";
import { tool } from "ai";
import z from "zod";

export const getSkillsTool = (resumeId: string) =>
	tool({
		description: "Fetches the skills data for a given resume ID.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getSkillsByResumeId(resumeId);

				// Check if the response is an error
				if (isCustomError(response)) {
					throw new Error(`Failed to fetch skills: ${response.message}`);
				}

				return jsonToToon(response as JsonObject);
			} catch (error) {
				throw new Error(`Unable to fetch skills data: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
