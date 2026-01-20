import { getResumeByIdTool, TOOL_NAMES, updateResumeTool, updateResumeInfoTool, updateSummaryTool, updateOrderTool, updateLinksTool } from "@/ai/tools";
import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { messages, resumeId }: { messages: UIMessage[]; resumeId: string } = await req.json();

		// Convert UI messages to model messages format
		const modelMessages = await convertToModelMessages(messages);

		// System prompt for the resume assistant
		const systemPrompt = `You are an expert resume writing assistant. Your role is to help users improve their resumes by providing:

1. Specific, actionable suggestions for improving resume content
2. Better phrasing and action verbs for experiences and achievements
3. Tips on formatting and structure
4. Industry-specific advice when relevant
5. Guidance on tailoring resumes for specific job applications

When providing feedback:
- Be concise and direct
- Use bullet points for multiple suggestions
- Provide before/after examples when helpful
- Focus on quantifiable achievements
- Suggest strong action verbs

CRITICAL INSTRUCTIONS FOR UPDATES:
- NEVER guess, assume, or invent values for resume fields
- ONLY update fields that the user has explicitly provided or requested to change
- If a user asks to update something that is required but doesn't provide the new value, ask them for it
- Do not fill in missing information based on context or assumptions
- Always confirm what specific changes the user wants before making updates

The user is currently editing resume ID: ${resumeId}. Provide helpful, professional, and encouraging feedback while being precise about any updates you make.`;

		const result = streamText({
			model: openai("gpt-4o-mini"),
			system: systemPrompt,
			messages: modelMessages,
			tools: {
				[TOOL_NAMES.GET_RESUME_BY_ID]: getResumeByIdTool(resumeId),
				[TOOL_NAMES.UPDATE_RESUME]: updateResumeTool(resumeId),
				[TOOL_NAMES.UPDATE_RESUME_INFO]: updateResumeInfoTool(resumeId),
				[TOOL_NAMES.UPDATE_SUMMARY]: updateSummaryTool(resumeId),
				[TOOL_NAMES.UPDATE_ORDER]: updateOrderTool(resumeId),
				[TOOL_NAMES.UPDATE_LINKS]: updateLinksTool(resumeId),
			},
			stopWhen: stepCountIs(5),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Chat API error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to process chat request",
				message: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
