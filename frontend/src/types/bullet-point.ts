import { BaseEntity } from './common';

export type BulletPointDto = {
	text: string;
	order: number;
	educationId?: string;
	projectId?: string;
	workExperienceId?: string;
} & BaseEntity;
