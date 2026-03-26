import FetchClient from "@/lib/fetch";
import { WorkExperienceDto } from "@/types/work-experience";

export type PatchUpdateWorkExperienceRequest = {
	companyName?: string;
	companyLink?: string;
	title?: string;
	workType?: string;
	startDate?: string;
	endDate?: string | null;
	location?: string;
};

export const patchUpdateWorkExperience = async (workExperienceId: string, payload: PatchUpdateWorkExperienceRequest) => {
	return FetchClient.patch<PatchUpdateWorkExperienceRequest, WorkExperienceDto>(`/work-experience/${workExperienceId}`, payload);
};
