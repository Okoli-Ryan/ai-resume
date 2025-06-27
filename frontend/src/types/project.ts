import { BulletPointDto } from './bullet-point';
import { BaseEntity } from './common';

export type ProjectDto = {
    name?: string;
    link?: string;
    userId: string;
    resumeId: string;
    bulletPoints: BulletPointDto[];
} & BaseEntity