import { BulletPointDto } from './bullet-point';
import { BaseEntity } from './common';

export type EducationDto = {
	schoolName?: string;
	degree?: string;
	fieldOfStudy?: string;
	location?: string;
	startDate?: string;
	endDate?: string | null;
	resumeId: string;
	userId: string;
	bulletPoints: BulletPointDto[];
} & BaseEntity;
