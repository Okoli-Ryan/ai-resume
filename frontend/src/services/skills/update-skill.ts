import FetchClient from "@/lib/fetch";
import { SkillDto } from "@/types/skill";

export type UpdateSkillRequest = {
	category: string;
	skills: string;
};

export const updateSkill = async (skillId: string, payload: UpdateSkillRequest) => {
	return FetchClient.post<SkillDto, UpdateSkillRequest>(`/skill/${skillId}`, payload);
};
