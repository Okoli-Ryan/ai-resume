import FetchClient from "@/lib/fetch";

export const deleteSkill = async (skillId: string) => {
	return FetchClient.delete<boolean>(`/skills/${skillId}`);
};
