import { z } from "zod";

import FetchClient from "@/lib/fetch";
import { AuthResponse } from "@/types/user";

export type SignupRequest = z.infer<typeof SignupSchema>;

export const signup = async (payload: SignupRequest) => {
	return FetchClient.post<AuthResponse, SignupRequest>(`/auth/register`, payload);
};

export const SignupSchema = z.object({
	email: z.string().email("Invalid email address"),
	name: z.string().min(2, "Name must be at least 2 characters"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
