import { getResumeById } from "@/services/resume/get-resume-by-id";
import { isCustomError } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		if (!id) {
			return new Response(JSON.stringify({ error: "Resume ID is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const response = await getResumeById(id);

		if (isCustomError(response)) {
			return new Response(JSON.stringify({ error: response.message }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Resume API error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to fetch resume",
				message: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
