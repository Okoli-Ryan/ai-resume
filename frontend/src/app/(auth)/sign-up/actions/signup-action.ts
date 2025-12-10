"use server"

import { signIn } from "@/auth";
import { ActionResponse, isCustomError } from "@/lib/utils";
import { signup, SignupRequest, SignupSchema } from "@/services/auth/signup";
import { AuthError } from "next-auth";

export async function signupWithEmailPasswordAction(payload: SignupRequest) {
	const validation = SignupSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	const response = await signup(validation.data);
	if (isCustomError(response)) return ActionResponse.error(response);

	// After successful signup, sign in the user using NextAuth
	try {
		await signIn("credentials", {
			email: validation.data.email,
			password: validation.data.password,
			redirect: false,
		});

		return ActionResponse.success({ message: "Account created successfully" });
	} catch (error) {
		if (error instanceof AuthError) {
			return ActionResponse.error({ message: "Account created but sign in failed: " + error.message });
		}
		return ActionResponse.error({ message: "Account created but sign in failed" });
	}
}
