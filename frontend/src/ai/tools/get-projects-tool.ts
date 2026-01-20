import { isCustomError } from "@/lib/utils";
import { getProjectsByResumeId } from "@/services/resume/get-projects-by-resume-id";
import { JsonObject, jsonToToon } from "@jojojoseph/toon-json-converter";
import { tool } from "ai";
import z from "zod";

export const getProjectsTool = (resumeId: string) =>
	tool({
		description: "Fetches the projects data for a given resume ID.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getProjectsByResumeId(resumeId);

				// Check if the response is an error
				if (isCustomError(response)) {
					throw new Error(`Failed to fetch projects: ${response.message}`);
				}

				return jsonToToon(response as JsonObject);
			} catch (error) {
				throw new Error(`Unable to fetch projects data: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
