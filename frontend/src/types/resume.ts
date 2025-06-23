import { BaseEntity } from './common';
import { EducationDto } from "./education";
import { ProjectDto } from "./project";
import { SkillDto } from "./skill";
import { WorkExperienceDto } from "./work-experience";

export type TResume = {
	userName: string;
	resumeName: string;
	email: string;
	tags?: string;
	summary: string;
	role: string;
	address: string;
	phoneNumber: string;
	linkedinUrl: string;
	githubUrl: string;
	portfolioUrl: string;
	userId: string;
	workExperience: WorkExperienceDto[];
	education: EducationDto[];
	projects: ProjectDto[];
	skills: SkillDto[];
} & BaseEntity;
