import FetchClient from "@/lib/fetch";
import { WorkExperienceDto } from "@/types/work-experience";
import { BulletPointDto } from "@/types/bullet-point";

export type CreateWorkExperienceRequest = {
	resumeId: string;
	companyName?: string;
	companyLink?: string;
	title?: string;
	workType?: string;
	startDate?: string;
	endDate?: string;
	isOngoing?: boolean;
	location?: string;
	bulletPoints?: Omit<BulletPointDto, "id" | "activeStatus" | "createdAt" | "updatedAt">[];
};

export const createWorkExperience = async (payload: CreateWorkExperienceRequest) => {
	return FetchClient.post<WorkExperienceDto, CreateWorkExperienceRequest>("/work-experience", payload);
};
