import { TResume } from "@/types/resume";
import { useQuery } from "@tanstack/react-query";

export type MinimalResumeQueryFilters = {
	resumeName?: string;
	tags?: string;
	dateFrom?: string;
	dateTo?: string;
	isFavourite?: boolean;
};

const MINIMAL_RESUMES_KEY = "minimal-resumes";

export const getMinimalResumesQueryKey = (filters: MinimalResumeQueryFilters) =>
	[MINIMAL_RESUMES_KEY, filters.resumeName, filters.tags, filters.dateFrom, filters.dateTo, filters.isFavourite] as const;

const fetchMinimalResumes = async (filters: MinimalResumeQueryFilters): Promise<Partial<TResume>[]> => {
	const params = new URLSearchParams();
	if (filters.resumeName) params.set("resumeName", filters.resumeName);
	if (filters.tags) params.set("tags", filters.tags);
	if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
	if (filters.dateTo) params.set("dateTo", filters.dateTo);
	if (filters.isFavourite === true) params.set("isFavourite", "true");

	const query = params.toString();
	const response = await fetch(`/api/resume/minimal${query ? `?${query}` : ""}`);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to fetch resumes");
	}

	return response.json();
};

const hasActiveFilters = (filters: MinimalResumeQueryFilters) =>
	!!(filters.resumeName || filters.tags || filters.dateFrom || filters.dateTo || filters.isFavourite);

export const useMinimalResumes = (
	filters: MinimalResumeQueryFilters,
	initialData: Partial<TResume>[]
) => {
	return useQuery({
		queryKey: getMinimalResumesQueryKey(filters),
		queryFn: () => fetchMinimalResumes(filters),
		initialData: hasActiveFilters(filters) ? undefined : initialData,
	});
};
