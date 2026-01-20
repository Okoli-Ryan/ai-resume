import { BaseEntity } from './common';

export type ResumeInfo = {
	userName: string;
	resumeName: string;
	email: string;
	tags?: string;
	summary: string;
	role: string;
	order: string;
	address: string;
	phoneNumber: string;
	isFavourite: boolean;
	linkedinUrl: string;
	githubUrl: string;
	portfolioUrl: string;
	userId: string;
} & BaseEntity;
