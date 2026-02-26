import FetchClient from "@/lib/fetch";
import { ProjectDto } from "@/types/project";
import { BulletPointDto } from "@/types/bullet-point";

export type CreateProjectRequest = {
	resumeId: string;
	name?: string;
	link?: string;
	order?: number;
	bulletPoints?: Omit<BulletPointDto, "id" | "activeStatus" | "createdAt" | "updatedAt">[];
};

export const createProject = async (payload: CreateProjectRequest) => {
	return FetchClient.post<ProjectDto, CreateProjectRequest>("/project", payload);
};
