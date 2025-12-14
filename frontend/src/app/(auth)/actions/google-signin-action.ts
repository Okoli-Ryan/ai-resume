"use server";
import { signIn } from "@/auth";
import { Routes } from "@/lib/routes";

export async function signinWithGoogle() {
	await signIn("google", { redirectTo: Routes.dashboard });
}
