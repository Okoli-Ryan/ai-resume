import FetchClient from "@/lib/fetch";
import { SkillDto } from "@/types/skill";

export type CreateSkillRequest = {
	resumeId: string;
	group: string;
	skills: string;
};

export const createSkill = async (payload: CreateSkillRequest) => {
	return FetchClient.post<SkillDto, CreateSkillRequest>("/skill", payload);
};
