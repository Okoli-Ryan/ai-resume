import FetchClient from "@/lib/fetch";

export const deleteProject = async (projectId: string) => {
	return FetchClient.delete<boolean>(`/project/${projectId}`);
};
