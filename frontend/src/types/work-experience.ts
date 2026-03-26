import { BulletPointDto } from './bullet-point';
import { BaseEntity } from './common';

export type WorkExperienceDto = {
	resumeId: string;
	companyName: string;
	companyLink?: string;
	title?: string;
	startDate?: string;
	endDate?: string | null;
	location?: string;
	workType?: string;
	userId?: string;
	bulletPoints: BulletPointDto[];
} & BaseEntity;
