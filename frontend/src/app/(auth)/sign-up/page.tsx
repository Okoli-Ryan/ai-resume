"use client";

import { signupWithEmailPasswordAction } from "./actions/signup-action";
import { signinWithGoogle } from "../actions/google-signin-action";
import ErrorLabel from "@/components/error-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileText, Mail, Lock, User } from "lucide-react";
import { SignupRequest } from "@/services/auth/signup";

const Signup = () => {
	const router = useRouter();
	const form = useForm<SignupRequest>({
		defaultValues: {
			email: "",
			name: "",
			password: "",
			confirmPassword: "",
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
			router.push(Routes.dashboard);
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: SignupRequest) => {
		signup(data);
	};

	return (
		<div className="min-h-screen flex">
			<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-between">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
						<FileText className="w-7 h-7 text-white" />
					</div>
					<span className="text-2xl font-bold text-white">I-CV</span>
				</div>
				<div className="space-y-6">
					<h1 className="text-4xl font-bold text-white leading-tight">Start building your professional resume today</h1>
					<p className="text-lg text-indigo-100">Create a stunning resume in minutes with AI-powered suggestions and professional templates.</p>
					<div className="space-y-4 text-indigo-100">
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">1</div>
							<span>Sign up for free</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">2</div>
							<span>Add your experience and skills</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">3</div>
							<span>Let AI enhance your content</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">4</div>
							<span>Download and apply!</span>
						</div>
					</div>
				</div>
				<p className="text-sm text-indigo-200">Trusted by professionals worldwide</p>
			</div>

			<div className="w-full lg:w-1/2 flex items-center justify-center p-8">
				<div className="w-full max-w-md space-y-8">
					<div className="lg:hidden flex items-center justify-center gap-2 mb-8">
						<div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
							<FileText className="w-6 h-6 text-white" />
						</div>
						<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">I-CV</span>
					</div>

					<div className="space-y-2 text-center lg:text-left">
						<h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
						<p className="text-gray-500">Start building your professional resume today</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-gray-700 font-medium">
								Full Name
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									{...register("name")}
								/>
							</div>
							<ErrorLabel control={control} name="name" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-700 font-medium">
								Email
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									{...register("email")}
								/>
							</div>
							<ErrorLabel control={control} name="email" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700 font-medium">
								Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input
									id="password"
									type="password"
									placeholder="Create a strong password"
									className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									{...register("password")}
								/>
							</div>
							<ErrorLabel control={control} name="password" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
								Confirm Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirm your password"
									className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									{...register("confirmPassword")}
								/>
							</div>
							<ErrorLabel control={control} name="confirmPassword" />
						</div>
						<Button
							type="submit"
							className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/25"
							loading={isPending}>
							Create Account
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-gray-200" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-4 text-gray-500">Or continue with</span>
						</div>
					</div>

					<form action={signinWithGoogle}>
						<Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 font-medium">
							<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</Button>
					</form>

					<p className="text-center text-sm text-gray-500">
						Already have an account?{" "}
						<Link href={Routes.signIn} className="font-semibold text-indigo-600 hover:text-indigo-700">
							Sign in instead
						</Link>
					</p>

					<p className="text-center text-xs text-gray-400">
						<Link href="/landing" className="hover:text-gray-600">
							Back to home
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
