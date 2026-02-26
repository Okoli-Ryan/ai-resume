import FetchClient from "@/lib/fetch";
import { EducationDto } from "@/types/education";
import { BulletPointDto } from "@/types/bullet-point";

export type CreateEducationRequest = {
	resumeId: string;
	schoolName?: string;
	degree?: string;
	fieldOfStudy?: string;
	location?: string;
	isOngoing?: boolean;
	startDate?: string;
	endDate?: string;
	bulletPoints?: Omit<BulletPointDto, "id" | "activeStatus" | "createdAt" | "updatedAt">[];
};

export const createEducation = async (payload: CreateEducationRequest) => {
	return FetchClient.post<EducationDto, CreateEducationRequest>("/education", payload);
};
