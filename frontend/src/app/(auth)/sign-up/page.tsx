"use client";

import { signupWithEmailPasswordAction } from "./actions/signup-action";
import { signinWithGoogle } from "../actions/google-signin-action";
import ErrorLabel from "@/components/error-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Routes } from "@/lib/routes";
import { SignupRequest } from "@/services/auth/signup";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Signup = () => {
	const router = useRouter();
	const form = useForm<SignupRequest>({
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
	});

	const { register, handleSubmit, control } = form;

	const { mutate: signup, isPending } = useMutation({
		mutationKey: ["signup"],
		mutationFn: async (data: SignupRequest) => {
			const response = await signupWithEmailPasswordAction(data);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: () => {
			router.push("/");
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: SignupRequest) => {
		signup(data);
	};

	return (
		<div className="mx-auto max-w-sm space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Sign Up</h1>
				<p className="text-gray-500 dark:text-gray-400">
					Create an account to get started
				</p>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Full Name</Label>
					<Input
						id="name"
						type="text"
						placeholder="John Doe"
						{...register("name")}
					/>
					<ErrorLabel control={control} name="name" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						{...register("email")}
					/>
					<ErrorLabel control={control} name="email" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						{...register("password")}
					/>
					<ErrorLabel control={control} name="password" />
				</div>
				<Button type="submit" className="w-full" loading={isPending}>
					Sign up
				</Button>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<form action={signinWithGoogle}>
				<Button variant="outline" className="w-full">
					Google
				</Button>
			</form>
			<p className="text-center text-sm text-gray-500">
				Already have an account?{" "}
				<Link href={Routes.signIn} className="font-medium text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	);
};

export default Signup;
