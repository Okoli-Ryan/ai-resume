import { isCustomError } from "@/lib/utils";
import { getMinimalResumes } from "@/services/resume/get-minimal-resume-list";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const resumeName = searchParams.get("resumeName") ?? undefined;
		const tags = searchParams.get("tags") ?? undefined;
		const dateFrom = searchParams.get("dateFrom") ?? undefined;
		const dateTo = searchParams.get("dateTo") ?? undefined;
		const isFavouriteParam = searchParams.get("isFavourite");
		const isFavourite = isFavouriteParam === "true" ? true : undefined;

		const response = await getMinimalResumes({ resumeName, tags, dateFrom, dateTo, isFavourite });

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
		console.error("Minimal resume list API error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to fetch resumes",
				message: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
