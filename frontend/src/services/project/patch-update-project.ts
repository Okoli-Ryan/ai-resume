import FetchClient from "@/lib/fetch";
import { ProjectDto } from "@/types/project";

export type PatchUpdateProjectRequest = {
	projectName?: string;
	projectUrl?: string;
};

export const patchUpdateProject = async (projectId: string, payload: PatchUpdateProjectRequest) => {
	return FetchClient.patch<PatchUpdateProjectRequest, ProjectDto>(`/project/${projectId}`, payload);
};
