import { BaseEntity } from './common';

export type AuthResponse = {
	token: string;
	user: User;
};

export type User = {
	name: string;
	email: string;
} & BaseEntity;
