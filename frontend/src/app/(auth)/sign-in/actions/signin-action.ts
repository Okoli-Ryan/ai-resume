"use server"

import { signIn } from "@/auth";
import { ActionResponse } from "@/lib/utils";
import { SigninRequest, SigninSchema } from "@/services/auth/signin";
import { AuthError } from "next-auth";

export async function signinWithEmailPasswordAction(payload: SigninRequest) {
	const validation = SigninSchema.safeParse(payload);
	if (!validation.success) return ActionResponse.error(validation.error);

	try {
		await signIn("credentials", {
			...validation.data,
			redirect: false,
		});

		return ActionResponse.success({ message: "Signed in successfully" });
	} catch (error) {
		if (error instanceof AuthError) {
			return ActionResponse.error({ message: error.message });
		}
		return ActionResponse.error({ message: "An error occurred during sign in" });
	}
}