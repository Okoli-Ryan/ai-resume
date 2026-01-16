/**
 * AI Tools Registry
 * 
 * This file exports all available AI tools and their type-safe identifiers.
 * Use TOOL_NAMES for strict type checking when handling tool calls.
 */

export { getResumeByIdTool } from "./get-resume-by-id-tool";
export { updateResumeTool } from "./update-resume-tool";

/**
 * Constant object containing all tool names.
 * Use this for type-safe tool name references throughout the application.
 */
export const TOOL_NAMES = {
	GET_RESUME_BY_ID: "getResumeById",
	UPDATE_RESUME: "updateResume",
} as const;
