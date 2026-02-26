import { isCustomError } from "@/lib/utils";
import { updateBulletPoint } from "@/services/bullet-points/update-bullet-point";
import { tool } from "ai";
import z from "zod";
import { createUpdateSuccessResponse } from "@/ai/utils";

const updateBulletPointSchema = z.object({
	bulletPointId: z.string().describe("The ID of the bullet point to update"),
	text: z.string().describe("The new text content for the bullet point"),
});

export const updateBulletPointTool = () =>
	tool({
		description:
			"Updates a specific bullet point by its ID. Use this tool to modify the text content of an individual bullet point. IMPORTANT: Only use this when you have the specific bullet point ID that needs to be updated.",
		inputSchema: updateBulletPointSchema,
		execute: async ({ bulletPointId, text }) => {
			try {
				const response = await updateBulletPoint(bulletPointId, { text });

				if (isCustomError(response)) {
					throw new Error(`Failed to update bullet point: ${response.message}`);
				}

				return createUpdateSuccessResponse({ text });
			} catch (error) {
				throw new Error(`Unable to update bullet point: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
