import FetchClient from '@/lib/fetch';
import { TResume } from '@/types/resume';

export type MinimalResumeFilters = {
	resumeName?: string;
	tags?: string;
	dateFrom?: string;
	dateTo?: string;
	isFavourite?: boolean;
};

export const getMinimalResumes = async (filters?: MinimalResumeFilters) => {
	const params = new URLSearchParams();
	if (filters?.resumeName) params.set("resumeName", filters.resumeName);
	if (filters?.tags) params.set("tags", filters.tags);
	if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
	if (filters?.dateTo) params.set("dateTo", filters.dateTo);
	if (filters?.isFavourite === true) params.set("isFavourite", "true");

	const query = params.toString();
	return FetchClient.get<Partial<TResume>[]>(`/resume/minimal${query ? `?${query}` : ""}`);
};
