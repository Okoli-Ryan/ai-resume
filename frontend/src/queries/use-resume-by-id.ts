import { TResume } from "@/types/resume";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const RESUME_QUERY_KEY = "resume";

export const getResumeById = async (id: string): Promise<TResume> => {
	const response = await fetch(`/api/resume/${id}`);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch resume");
	}

	return response.json();
};

export const getResumeQueryKey = (id: string) => [RESUME_QUERY_KEY, id] as const;

export const useResumeById = (id: string) => {
	return useQuery({
		queryKey: getResumeQueryKey(id),
		queryFn: () => getResumeById(id),
	});
};

export const useInvalidateResume = () => {
	const queryClient = useQueryClient();

	return useCallback(
		(id: string) => {
			return queryClient.invalidateQueries({
				queryKey: getResumeQueryKey(id),
			});
		},
		[queryClient]
	);
};
