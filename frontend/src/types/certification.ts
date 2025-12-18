import { BulletPointDto } from './bullet-point';
import { BaseEntity } from './common';

export type CertificationDto = {
    certificationName?: string;
    certificateLink?: string;
    dateAttained?: string;
    resumeId: string;
    userId: string;
    bulletPoints: BulletPointDto[];
} & BaseEntity
