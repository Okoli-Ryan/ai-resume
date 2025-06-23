import { BulletPointDto } from './bullet-point';

export interface WorkExperienceDto {
	resumeId: string;
	companyName: string;
	companyLink?: string;
	title?: string;
	startDate?:  string;
	endDate?: string;
	isOngoing: boolean;
	location?: string;
    workType?: string
    userId?: string
	bulletPoints: BulletPointDto[];
}
