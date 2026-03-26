/**
 * Resume Patch Types
 *
 * This module defines the TypeScript types for the unified resume patch system.
 * The patch system allows CRUD operations on all resume sections through a single tool.
 */

// Base bullet point structure for patches
export type BulletPointPatch = {
	id?: string;
	text: string;
	order?: number;
};

// ============================================================================
// Work Experience Patch
// ============================================================================
export type WorkExperiencePatch = {
	operation: "add" | "update" | "delete";
	target: {
		section: "workExperience";
		id?: string;
	};
	payload?: {
		companyName?: string;
		companyLink?: string;
		title?: string;
		workType?: string;
		startDate?: string;
		endDate?: string | null;
		location?: string;
		bulletPoints?: BulletPointPatch[];
	};
};

// ============================================================================
// Project Patch
// ============================================================================
export type ProjectPatch = {
	operation: "add" | "update" | "delete";
	target: {
		section: "project";
		id?: string;
	};
	payload?: {
		name?: string;
		link?: string;
		bulletPoints?: BulletPointPatch[];
	};
};

// ============================================================================
// Education Patch
// ============================================================================
export type EducationPatch = {
	operation: "add" | "update" | "delete";
	target: {
		section: "education";
		id?: string;
	};
	payload?: {
		schoolName?: string;
		degree?: string;
		fieldOfStudy?: string;
		location?: string;
		startDate?: string;
		endDate?: string | null;
		bulletPoints?: BulletPointPatch[];
	};
};

// ============================================================================
// Certification Patch
// ============================================================================
export type CertificationPatch = {
	operation: "add" | "update" | "delete";
	target: {
		section: "certification";
		id?: string;
	};
	payload?: {
		certificationName?: string;
		certificateLink?: string;
		dateAttained?: string;
		bulletPoints?: BulletPointPatch[];
	};
};

// ============================================================================
// Skills Patch
// ============================================================================
export type SkillsPatch = {
	operation: "add" | "update" | "delete";
	target: {
		section: "skills";
		id?: string;
	};
	payload?: {
		category?: string;
		skills?: string; // Comma-separated skills list
	};
};

// ============================================================================
// Summary Patch
// ============================================================================
export type SummaryPatch = {
	operation: "update";
	target: {
		section: "summary";
	};
	payload: {
		summary: string;
	};
};

// ============================================================================
// Resume Info Patch (personal info, contact details)
// ============================================================================
export type ResumeInfoPatch = {
	operation: "update";
	target: {
		section: "resumeInfo";
	};
	payload?: {
		userName?: string;
		resumeName?: string;
		email?: string;
		tags?: string;
		role?: string;
		address?: string;
		phoneNumber?: string;
		linkedinUrl?: string;
		githubUrl?: string;
		portfolioUrl?: string;
	};
};

// ============================================================================
// Links Patch
// ============================================================================
export type LinkPatch = {
	operation: "add" | "update" | "delete";
	target: {
		section: "links";
		id?: string;
	};
	payload?: {
		name?: string;
		url?: string;
		index?: number;
	};
};

// ============================================================================
// Order Patch
// ============================================================================
export type OrderPatch = {
	operation: "update";
	target: {
		section: "order";
	};
	payload: {
		order: string; // Comma-separated section order
	};
};

// ============================================================================
// Union Type for All Patches
// ============================================================================
export type ResumePatch =
	| WorkExperiencePatch
	| ProjectPatch
	| EducationPatch
	| CertificationPatch
	| SkillsPatch
	| SummaryPatch
	| ResumeInfoPatch
	| LinkPatch
	| OrderPatch;

// Section type for easy reference
export type ResumePatchSection = ResumePatch["target"]["section"];

// Operation types
export type PatchOperation = "add" | "update" | "delete";
