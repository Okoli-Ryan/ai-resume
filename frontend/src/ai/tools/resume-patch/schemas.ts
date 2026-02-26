/**
 * Resume Patch Zod Schemas
 *
 * This module defines the Zod validation schemas for the unified resume patch system.
 * These schemas are used for input validation in the AI tool.
 */

import { z } from "zod";

// ============================================================================
// Base Schemas
// ============================================================================
const BulletPointPatchSchema = z.object({
	id: z.string().optional().describe("The ID of an existing bullet point to update. Omit for new bullet points."),
	text: z.string().describe("The text content of the bullet point"),
	order: z.number().optional().describe("The order/position of the bullet point"),
});

const operationSchema = z.enum(["add", "update", "delete"]).describe("The operation to perform");
const updateOnlyOperationSchema = z.literal("update").describe("Only update operation is allowed for this section");

// ============================================================================
// Work Experience Patch Schema
// ============================================================================
export const WorkExperiencePatchSchema = z.object({
	operation: operationSchema,
	target: z.object({
		section: z.literal("workExperience"),
		id: z.string().optional().describe("The ID of the work experience entry. Required for update/delete operations."),
	}),
	payload: z
		.object({
			companyName: z.string().optional().describe("The name of the company"),
			companyLink: z.string().optional().describe("Link to the company website"),
			title: z.string().optional().describe("Job title or position held"),
			workType: z.string().optional().describe("Type of work (e.g., Full-time, Part-time, Contract, Remote)"),
			startDate: z.string().optional().describe("Start date of the position (ISO format: YYYY-MM-DD)"),
			endDate: z.string().optional().describe("End date of the position (ISO format: YYYY-MM-DD). Null if ongoing."),
			isOngoing: z.boolean().optional().describe("Whether the position is currently ongoing"),
			location: z.string().optional().describe("Location of the work (e.g., city, state, or remote)"),
			bulletPoints: z.array(BulletPointPatchSchema).optional().describe("List of bullet points describing responsibilities and achievements"),
		})
		.optional()
		.describe("The payload containing the fields to update. Required for add/update operations."),
});

// ============================================================================
// Project Patch Schema
// ============================================================================
export const ProjectPatchSchema = z.object({
	operation: operationSchema,
	target: z.object({
		section: z.literal("project"),
		id: z.string().optional().describe("The ID of the project. Required for update/delete operations."),
	}),
	payload: z
		.object({
			name: z.string().optional().describe("The name of the project"),
			link: z.string().optional().describe("URL link to the project (e.g., GitHub, live demo)"),
			bulletPoints: z.array(BulletPointPatchSchema).optional().describe("List of bullet points describing the project"),
		})
		.optional()
		.describe("The payload containing the fields to update. Required for add/update operations."),
});

// ============================================================================
// Education Patch Schema
// ============================================================================
export const EducationPatchSchema = z.object({
	operation: operationSchema,
	target: z.object({
		section: z.literal("education"),
		id: z.string().optional().describe("The ID of the education entry. Required for update/delete operations."),
	}),
	payload: z
		.object({
			schoolName: z.string().optional().describe("The name of the school or educational institution"),
			degree: z.string().optional().describe("The degree obtained or being pursued (e.g., Bachelor's, Master's, PhD)"),
			fieldOfStudy: z.string().optional().describe("The field of study or major"),
			location: z.string().optional().describe("Location of the school"),
			isOngoing: z.boolean().optional().describe("Whether the education is currently ongoing"),
			startDate: z.string().optional().describe("Start date of the education (ISO format: YYYY-MM-DD)"),
			endDate: z.string().optional().describe("End date of the education (ISO format: YYYY-MM-DD). Null if ongoing."),
			bulletPoints: z.array(BulletPointPatchSchema).optional().describe("List of bullet points describing achievements, coursework, etc."),
		})
		.optional()
		.describe("The payload containing the fields to update. Required for add/update operations."),
});

// ============================================================================
// Certification Patch Schema
// ============================================================================
export const CertificationPatchSchema = z.object({
	operation: operationSchema,
	target: z.object({
		section: z.literal("certification"),
		id: z.string().optional().describe("The ID of the certification. Required for update/delete operations."),
	}),
	payload: z
		.object({
			certificationName: z.string().optional().describe("The name of the certification"),
			certificateLink: z.string().optional().describe("URL link to the certificate or credential"),
			dateAttained: z.string().optional().describe("Date when the certification was attained (ISO format: YYYY-MM-DD)"),
			bulletPoints: z.array(BulletPointPatchSchema).optional().describe("List of bullet points describing the certification details"),
		})
		.optional()
		.describe("The payload containing the fields to update. Required for add/update operations."),
});

// ============================================================================
// Skills Patch Schema
// ============================================================================
export const SkillsPatchSchema = z.object({
	operation: operationSchema,
	target: z.object({
		section: z.literal("skills"),
		id: z.string().optional().describe("The ID of the skill category. Required for update/delete operations."),
	}),
	payload: z
		.object({
			category: z.string().optional().describe("The category name for grouping skills (e.g., Programming Languages, Frameworks, Tools)"),
			skills: z.string().optional().describe("Comma-separated list of skills in this category (e.g., 'JavaScript, TypeScript, Python')"),
		})
		.optional()
		.describe("The payload containing the fields to update. Required for add/update operations."),
});

// ============================================================================
// Summary Patch Schema
// ============================================================================
export const SummaryPatchSchema = z.object({
	operation: updateOnlyOperationSchema,
	target: z.object({
		section: z.literal("summary"),
	}),
	payload: z.object({
		summary: z.string().describe("The professional summary or objective statement for the resume"),
	}),
});

// ============================================================================
// Resume Info Patch Schema
// ============================================================================
export const ResumeInfoPatchSchema = z.object({
	operation: updateOnlyOperationSchema,
	target: z.object({
		section: z.literal("resumeInfo"),
	}),
	payload: z
		.object({
			userName: z.string().optional().describe("The user's full name"),
			resumeName: z.string().optional().describe("The name/title of the resume document"),
			email: z.string().email().optional().describe("The user's email address"),
			tags: z.string().optional().describe("Tags for categorizing the resume (comma-separated)"),
			role: z.string().optional().describe("The user's current or target job title/role"),
			address: z.string().optional().describe("The user's address or location"),
			phoneNumber: z.string().optional().describe("The user's phone number"),
			linkedinUrl: z.string().url().optional().describe("LinkedIn profile URL"),
			githubUrl: z.string().url().optional().describe("GitHub profile URL"),
			portfolioUrl: z.string().url().optional().describe("Portfolio website URL"),
		})
		.optional()
		.describe("The payload containing the fields to update."),
});

// ============================================================================
// Links Patch Schema
// ============================================================================
export const LinkPatchSchema = z.object({
	operation: operationSchema,
	target: z.object({
		section: z.literal("links"),
		id: z.string().optional().describe("The ID of the link. Required for update/delete operations."),
	}),
	payload: z
		.object({
			name: z.string().optional().describe("The display name for the link"),
			url: z.string().url().optional().describe("The URL of the link"),
			index: z.number().optional().describe("The order/position of the link"),
		})
		.optional()
		.describe("The payload containing the fields to update. Required for add/update operations."),
});

// ============================================================================
// Order Patch Schema
// ============================================================================
export const OrderPatchSchema = z.object({
	operation: updateOnlyOperationSchema,
	target: z.object({
		section: z.literal("order"),
	}),
	payload: z.object({
		order: z
			.string()
			.describe("Comma-separated order of resume sections (e.g., 'summary,workExperience,education,projects,skills,certifications')"),
	}),
});

// ============================================================================
// Unified Resume Patch Schema
// Note: z.discriminatedUnion doesn't support nested paths like "target.section"
// so we use a regular union with refinement for validation
// ============================================================================
export const ResumePatchSchemaManual = z.union([
	WorkExperiencePatchSchema,
	ProjectPatchSchema,
	EducationPatchSchema,
	CertificationPatchSchema,
	SkillsPatchSchema,
	SummaryPatchSchema,
	ResumeInfoPatchSchema,
	LinkPatchSchema,
	OrderPatchSchema,
]);

// ============================================================================
// Resume Patch Tool Input Schema
// ============================================================================
export const ResumePatchToolSchema = z.object({
	patches: z
		.array(ResumePatchSchemaManual)
		.min(1)
		.describe("An array of patch operations to apply to the resume. Each patch specifies an operation, target section, and payload."),
});

// Export types inferred from schemas
export type WorkExperiencePatchInput = z.infer<typeof WorkExperiencePatchSchema>;
export type ProjectPatchInput = z.infer<typeof ProjectPatchSchema>;
export type EducationPatchInput = z.infer<typeof EducationPatchSchema>;
export type CertificationPatchInput = z.infer<typeof CertificationPatchSchema>;
export type SkillsPatchInput = z.infer<typeof SkillsPatchSchema>;
export type SummaryPatchInput = z.infer<typeof SummaryPatchSchema>;
export type ResumeInfoPatchInput = z.infer<typeof ResumeInfoPatchSchema>;
export type LinkPatchInput = z.infer<typeof LinkPatchSchema>;
export type OrderPatchInput = z.infer<typeof OrderPatchSchema>;
export type ResumePatchInput = z.infer<typeof ResumePatchSchemaManual>;
export type ResumePatchToolInput = z.infer<typeof ResumePatchToolSchema>;
