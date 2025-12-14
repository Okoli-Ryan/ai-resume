import { z } from "zod";

import FetchClient from "@/lib/fetch";
import { AuthResponse } from "@/types/user";

export type SignupRequest = z.infer<typeof SignupSchema>;

export const signup = async (payload: SignupRequest) => {
	return FetchClient.post<AuthResponse, SignupRequest>(`/auth/register`, payload, { hasAuthorization: false });
};

export const SignupSchema = z
	.object({
		email: z.string().email("Please enter a valid email address"),
		name: z.string().min(1, "Name is required"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
