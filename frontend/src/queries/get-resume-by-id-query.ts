import { TResume } from "@/types/resume";

export const getResumeByIdQuery = async (id: string): Promise<TResume> => {
	const response = await fetch(`/api/resume/${id}`);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch resume");
	}

	return response.json();
};
