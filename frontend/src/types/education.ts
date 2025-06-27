import { BulletPointDto } from './bullet-point';
import { BaseEntity } from './common';

export type EducationDto = {
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
} & BaseEntity
