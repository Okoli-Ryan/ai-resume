import { BulletPointDto } from './bullet-point';

export interface ProjectDto {
    name?: string;
    link?: string;
    userId: string;
    resumeId: string;
    bulletPoints: BulletPointDto[];
}
