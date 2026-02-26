/**
 * Resume Patch Module
 *
 * This module provides a unified patch-based system for CRUD operations
 * on all resume sections. It consolidates multiple tools into a single
 * interface to minimize the number of tools the LLM needs to handle.
 *
 * Exports:
 * - resumePatchTool: The main AI tool for resume patches
 * - Types: TypeScript types for patches
 * - Schemas: Zod schemas for validation
 * - Handlers: Individual section handlers
 */

// Main tool export
export { resumePatchTool } from "./resume-patch-tool";

// Schema exports
export {
	// Individual section schemas
	WorkExperiencePatchSchema,
	ProjectPatchSchema,
	EducationPatchSchema,
	CertificationPatchSchema,
	SkillsPatchSchema,
	SummaryPatchSchema,
	ResumeInfoPatchSchema,
	LinkPatchSchema,
	OrderPatchSchema,
	// Union schemas
	ResumePatchSchemaManual,
	ResumePatchToolSchema,
	// Types inferred from schemas
	type WorkExperiencePatchInput,
	type ProjectPatchInput,
	type EducationPatchInput,
	type CertificationPatchInput,
	type SkillsPatchInput,
	type SummaryPatchInput,
	type ResumeInfoPatchInput,
	type LinkPatchInput,
	type OrderPatchInput,
	type ResumePatchInput,
	type ResumePatchToolInput,
} from "./schemas";

// Type exports
export type {
	// Patch types
	BulletPointPatch,
	WorkExperiencePatch,
	ProjectPatch,
	EducationPatch,
	CertificationPatch,
	SkillsPatch,
	SummaryPatch,
	ResumeInfoPatch,
	LinkPatch,
	OrderPatch,
	ResumePatch,
	ResumePatchSection,
	PatchOperation,
} from "./types";

// Handler exports (for testing and advanced use cases)
export {
	executePatch,
	executePatchBatch,
	handleWorkExperiencePatch,
	handleProjectPatch,
	handleEducationPatch,
	handleCertificationPatch,
	handleSkillsPatch,
	handleSummaryPatch,
	handleResumeInfoPatch,
	handleLinkPatch,
	handleOrderPatch,
	type PatchResult,
} from "./handlers";
