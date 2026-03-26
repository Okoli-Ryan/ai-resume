import FetchClient from "@/lib/fetch";
import { EducationDto } from "@/types/education";

export type PatchUpdateEducationRequest = {
	schoolName?: string;
	degree?: string;
	fieldOfStudy?: string;
	location?: string;
	startDate?: string;
	endDate?: string | null;
};

export const patchUpdateEducation = async (educationId: string, payload: PatchUpdateEducationRequest) => {
	return FetchClient.patch<PatchUpdateEducationRequest, EducationDto>(`/education/${educationId}`, payload);
};
