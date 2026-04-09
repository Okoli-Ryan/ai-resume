import { isCustomError } from "@/lib/utils";
import { getFileByResumeId } from "@/services/file-upload/get-file-by-resume-id";
import { tool } from "ai";
import z from "zod";

export const getUploadedResumeTool = (resumeId: string) =>
	tool({
		description:
			"Fetches the uploaded resume PDF URL for the current resume. Always call this tool when the user asks for their uploaded resume URL or file — never use a previously seen URL from the conversation, as the file may have changed.",
		inputSchema: z
			.object({
				resumeId: z.string(),
			})
			.default({ resumeId }),
		execute: async ({ resumeId }) => {
			try {
				const response = await getFileByResumeId(resumeId);

				if (isCustomError(response)) {
					throw new Error(`Failed to fetch uploaded resume: ${response.message}`);
				}

				return response.shortenedUrl;
			} catch (error) {
				throw new Error(`Unable to fetch uploaded resume file: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
