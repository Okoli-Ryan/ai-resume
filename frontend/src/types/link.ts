import { BaseEntity } from './common';

export type LinkDto = {
	url: string;
	name: string;
	index: number;
	resumeId: string;
	userId: string;
} & BaseEntity;
