/**
 * AI Tools Registry
 * 
 * This file exports all available AI tools and their type-safe identifiers.
 * Use TOOL_NAMES for strict type checking when handling tool calls.
 */

export { getResumeByIdTool } from "./get-resume-by-id-tool";
export { getResumeInfoTool } from "./get-resume-info-tool";
export { getCertificationsTool } from "./get-certifications-tool";
export { getProjectsTool } from "./get-projects-tool";
export { getSkillsTool } from "./get-skills-tool";
export { getWorkExperienceTool } from "./get-work-experience-tool";
export { getEducationTool } from "./get-education-tool";
export { updateResumeTool } from "./update-resume-tool";
export { updateResumeInfoTool } from "./update-resume-info-tool";
export { updateSummaryTool } from "./update-summary-tool";
export { updateOrderTool } from "./update-order-tool";
export { updateLinksTool } from "./update-links-tool";

/**
 * Constant object containing all tool names.
 * Use this for type-safe tool name references throughout the application.
 */
export const TOOL_NAMES = {
	GET_RESUME_BY_ID: "get_resume_by_id",
	GET_RESUME_INFO: "get_resume_info",
	GET_CERTIFICATIONS: "get_certifications",
	GET_PROJECTS: "get_projects",
	GET_SKILLS: "get_skills",
	GET_WORK_EXPERIENCE: "get_work_experience",
	GET_EDUCATION: "get_education",
	UPDATE_RESUME: "update_resume",
	UPDATE_RESUME_INFO: "update_resume_info",
	UPDATE_SUMMARY: "update_summary",
	UPDATE_ORDER: "update_order",
	UPDATE_LINKS: "update_links",
} as const;

/**
 * Map indicating which tools require a resume refetch after execution.
 * Tools that modify resume data should be set to true.
 */
export const TOOL_REFETCH_MAP = {
	[TOOL_NAMES.GET_RESUME_BY_ID]: false,
	[TOOL_NAMES.GET_RESUME_INFO]: false,
	[TOOL_NAMES.GET_CERTIFICATIONS]: false,
	[TOOL_NAMES.GET_PROJECTS]: false,
	[TOOL_NAMES.GET_SKILLS]: false,
	[TOOL_NAMES.GET_WORK_EXPERIENCE]: false,
	[TOOL_NAMES.GET_EDUCATION]: false,
	[TOOL_NAMES.UPDATE_RESUME]: true,
	[TOOL_NAMES.UPDATE_RESUME_INFO]: true,
	[TOOL_NAMES.UPDATE_SUMMARY]: true,
	[TOOL_NAMES.UPDATE_ORDER]: true,
	[TOOL_NAMES.UPDATE_LINKS]: true,
} as const;
