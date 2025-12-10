import { z } from "zod";

import FetchClient from "@/lib/fetch";
import { AuthResponse } from "@/types/user";

export type SigninRequest = z.infer<typeof SigninSchema>;

export const signin = async (payload: SigninRequest) => {
	return FetchClient.post<AuthResponse, SigninRequest>(`/auth/login`, payload);
};

export const SigninSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
