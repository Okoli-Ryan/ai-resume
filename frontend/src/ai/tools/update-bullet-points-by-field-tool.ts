import { isCustomError } from "@/lib/utils";
import { updateBulletPointsByFieldId, FieldType } from "@/services/bullet-points/update-bullet-points-by-field";
import { tool } from "ai";
import z from "zod";
import { createUpdateSuccessResponse } from "@/ai/utils";

const updateBulletPointsByFieldSchema = z.object({
	fieldType: z.enum(["Education", "Project", "WorkExperience"]).describe("The type of field (Education, Project, or WorkExperience)"),
	fieldId: z.string().describe("The ID of the field (education, project, or work experience)"),
	bulletPoints: z.array(z.object({
		text: z.string().describe("The text content of the bullet point")
	})).describe("Array of bullet points to set for this field")
});

export const updateBulletPointsByFieldTool = () =>
	tool({
		description:
			"Updates all bullet points for a specific field (Education, Project, or WorkExperience). This replaces all existing bullet points for the specified field with the new ones provided. Use this when you need to update the complete set of bullet points for an education entry, project, or work experience.",
		inputSchema: updateBulletPointsByFieldSchema,
		execute: async ({ fieldType, fieldId, bulletPoints }) => {
			try {
				const response = await updateBulletPointsByFieldId(fieldType as FieldType, fieldId, { bulletPoints });

				if (isCustomError(response)) {
					throw new Error(`Failed to update bullet points: ${response.message}`);
				}

				return createUpdateSuccessResponse({ bulletPoints });
			} catch (error) {
				throw new Error(`Unable to update bullet points: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
	});
