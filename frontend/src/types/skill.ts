import { BaseEntity } from './common';

export type SkillDto = {
	category: string;
	skills: string;
	userId: string;
	resumeId: string;
} & BaseEntity