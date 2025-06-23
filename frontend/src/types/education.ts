import { BulletPointDto } from './bullet-point';

export interface EducationDto {
    schoolName?: string;
    degree?: string;
    fieldOfStudy?: string;
    location?: string;
    isOngoing: boolean;
    startDate?: string;
    endDate?: string;
    resumeId: string;
    userId: string;
    bulletPoints: BulletPointDto[];
}
