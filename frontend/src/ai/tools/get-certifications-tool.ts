import { isCustomError } from "@/lib/utils";
import { getCertificationsByResumeId } from "@/services/resume/get-certifications-by-resume-id";
import { JsonObject, jsonToToon } from "@jojojoseph/toon-json-converter";
import { tool } from "ai";
import z from "zod";

export const getCertificationsTool = (resumeId: string) =>
	tool({
		description: "Fetches the certifications data for a given resume ID.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getCertificationsByResumeId(resumeId);

				// Check if the response is an error
				if (isCustomError(response)) {
					throw new Error(`Failed to fetch certifications: ${response.message}`);
				}

				return jsonToToon(response as JsonObject);
			} catch (error) {
				throw new Error(`Unable to fetch certifications data: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
