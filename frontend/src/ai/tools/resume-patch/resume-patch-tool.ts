/**
 * Resume Patch Tool
 *
 * A unified tool for performing CRUD operations on all resume sections.
 * This tool consolidates multiple section-specific tools into a single
 * patch-based interface, reducing the number of tools the LLM needs to manage.
 *
 * @example
 * // Update work experience
 * {
 *   patches: [{
 *     operation: "update",
 *     target: { section: "workExperience", id: "123" },
 *     payload: { title: "Senior Developer" }
 *   }]
 * }
 *
 * // Add new education and update summary
 * {
 *   patches: [
 *     {
 *       operation: "add",
 *       target: { section: "education" },
 *       payload: { schoolName: "MIT", degree: "BS" }
 *     },
 *     {
 *       operation: "update",
 *       target: { section: "summary" },
 *       payload: { summary: "Experienced developer..." }
 *     }
 *   ]
 * }
 */

import { tool } from "ai";
import { jsonToToon } from "@jojojoseph/toon-json-converter";
import { ResumePatchToolSchema } from "./schemas";
import { executePatchBatch } from "./handlers";

export const resumePatchTool = (resumeId: string) =>
	tool({
		description: `A unified tool for performing CRUD operations on all resume sections. Use this tool to add, update, or delete entries in any resume section.

SUPPORTED SECTIONS:
- workExperience: Job positions with company, title, dates, and bullet points
- project: Projects with name, link, and bullet points  
- education: Schools with degree, field of study, and dates
- certification: Certifications with name, link, and date
- skills: Skill categories with comma-separated skills
- summary: Professional summary/objective (update only)
- resumeInfo: Personal info like name, email, role, contact details (update only)
- links: Custom links with name and URL
- order: Section display order (update only)

OPERATIONS:
- add: Create a new entry (requires payload, no id needed)
- update: Modify an existing entry (requires id and payload)
- delete: Remove an entry (requires id only)

Note: summary, resumeInfo, and order sections only support the "update" operation.

IMPORTANT: 
- For update/delete operations, you MUST provide the target.id
- Only include fields in payload that need to be changed
- Multiple patches can be sent in a single call for batch operations`,
		inputSchema: ResumePatchToolSchema,
		execute: async ({ patches }) => {
			try {
				const result = await executePatchBatch(patches, resumeId);

				return jsonToToon({
					success: result.success,
					summary: result.summary,
					details: result.results.map((r) => ({
						section: r.section,
						operation: r.operation,
						success: r.success,
						message: r.message,
						...(r.error && { error: r.error }),
					})),
				});
			} catch (error) {
				return jsonToToon({
					success: false,
					message: `Failed to execute resume patches: ${error instanceof Error ? error.message : "Unknown error"}`,
				});
			}
		},
	});
