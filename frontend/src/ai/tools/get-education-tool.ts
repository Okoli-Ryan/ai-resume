import { isCustomError } from "@/lib/utils";
import { getEducationByResumeId } from "@/services/resume/get-education-by-resume-id";
import { JsonObject, jsonToToon } from "@jojojoseph/toon-json-converter";
import { tool } from "ai";
import z from "zod";

export const getEducationTool = (resumeId: string) =>
	tool({
		description: "Fetches the education data for a given resume ID.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getEducationByResumeId(resumeId);

				// Check if the response is an error
				if (isCustomError(response)) {
					throw new Error(`Failed to fetch education: ${response.message}`);
				}

				return jsonToToon(response as JsonObject);
			} catch (error) {
				throw new Error(`Unable to fetch education data: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
