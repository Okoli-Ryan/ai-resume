import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from "ai";
import { getResumeByIdTool } from "./tools/get-resume-by-id-tool";
import { updateResumeTool } from "./tools/update-resume-tool";

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

The user is currently editing resume ID: ${resumeId}. Provide helpful, professional, and encouraging feedback.`;

		const result = streamText({
			model: openai("gpt-4o-mini"),
			system: systemPrompt,
			messages: modelMessages,
			tools: {
				getResumeById: getResumeByIdTool(resumeId),
				updateResume: updateResumeTool(resumeId),
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
			}
		);
	}
}
