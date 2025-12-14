"use client";

import { useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import ErrorLabel from "@/components/error-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";
import { User, Mail, Phone, Github, Linkedin, Globe, MapPin, Briefcase } from "lucide-react";

import FormLayout from "@/app/layouts/form-layout";
import SummaryForm from "../summary-form/summary-form";
import { updatePersonalInfoAction } from "./actions/update-personal-info-action";

const PersonalInfoForm = () => {
	const { id } = useParams<{ id: string }>();
	const resume = useResumeStore((state) => state.resume)!;
	const updateResume = useResumeStore((state) => state.update);
	const form = useForm<Partial<TResume>>({
		defaultValues: resume,
	});

	const { register, handleSubmit, control } = form;

	const { mutate: updatePersonalInfo, isPending } = useMutation({
		mutationKey: ["updatePersonalInfo"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updatePersonalInfoAction(data, id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (data: TResume) => {
			const appendedResume = {
				userName: data.userName,
				email: data.email,
				summary: data.summary,
				role: data.role,
				address: data.address,
				phoneNumber: data.phoneNumber,
				linkedinUrl: data.linkedinUrl,
				githubUrl: data.githubUrl,
				portfolioUrl: data.portfolioUrl,
				userId: data.userId,
			};
			updateResume(appendedResume);
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: Partial<TResume>) => {
		updatePersonalInfo(data);
	};

	return (
		<FormLayout>
			<FormProvider {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					{/* Personal Information Section */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
							Personal Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									Name
								</Label>
								<Input 
									id="name" 
									{...register("userName")} 
									className="transition-all focus:ring-2 focus:ring-primary/20"
									placeholder="Enter your full name"
								/>
								<ErrorLabel control={control} name="userName" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									Email
								</Label>
								<Input 
									id="email" 
									type="email" 
									{...register("email")} 
									className="transition-all focus:ring-2 focus:ring-primary/20"
									placeholder="your.email@example.com"
								/>
								<ErrorLabel control={control} name="email" />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									Phone Number
								</Label>
								<Input 
									id="phoneNumber" 
									{...register("phoneNumber")} 
									className="transition-all focus:ring-2 focus:ring-primary/20"
									placeholder="+1 (555) 123-4567"
								/>
								<ErrorLabel control={control} name="phoneNumber" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									Location
								</Label>
								<Input 
									id="location" 
									{...register("address")} 
									className="transition-all focus:ring-2 focus:ring-primary/20"
									placeholder="City, State/Country"
								/>
								<ErrorLabel control={control} name="address" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
								<Briefcase className="h-4 w-4 text-muted-foreground" />
								Role / Job Title
							</Label>
							<Input 
								id="role" 
								{...register("role")} 
								className="transition-all focus:ring-2 focus:ring-primary/20"
								placeholder="e.g., Software Engineer, Product Manager"
							/>
							<ErrorLabel control={control} name="role" />
						</div>
					</div>

					{/* Professional Summary Section */}
					<div className="space-y-4 pt-4 border-t border-border">
						<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
							Professional Summary
						</h3>
						<SummaryForm form={form} />
					</div>

					{/* Online Presence Section */}
					<div className="space-y-4 pt-4 border-t border-border">
						<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
							Online Presence
						</h3>
						<div className="grid grid-cols-1 gap-4">
							<div className="space-y-2">
								<Label htmlFor="githubUrl" className="text-sm font-medium flex items-center gap-2">
									<Github className="h-4 w-4 text-muted-foreground" />
									GitHub URL
								</Label>
								<Input 
									id="githubUrl" 
									{...register("githubUrl")} 
									className="transition-all focus:ring-2 focus:ring-primary/20"
									placeholder="https://github.com/username"
								/>
								<ErrorLabel control={control} name="githubUrl" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="linkedinUrl" className="text-sm font-medium flex items-center gap-2">
									<Linkedin className="h-4 w-4 text-muted-foreground" />
									LinkedIn URL
								</Label>
								<Input 
									id="linkedinUrl" 
									{...register("linkedinUrl")} 
									className="transition-all focus:ring-2 focus:ring-primary/20"
									placeholder="https://linkedin.com/in/username"
								/>
								<ErrorLabel control={control} name="linkedinUrl" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="portfolioUrl" className="text-sm font-medium flex items-center gap-2">
									<Globe className="h-4 w-4 text-muted-foreground" />
									Portfolio URL
								</Label>
								<Input 
									id="portfolioUrl" 
									{...register("portfolioUrl")} 
									className="transition-all focus:ring-2 focus:ring-primary/20"
									placeholder="https://yourportfolio.com"
								/>
								<ErrorLabel control={control} name="portfolioUrl" />
							</div>
						</div>
					</div>

					<Button 
						type="submit" 
						className="w-full mt-6 h-11 font-medium transition-all hover:shadow-md" 
						disabled={isPending}
					>
						{isPending ? "Updating..." : "Save Changes"}
					</Button>
				</form>
			</FormProvider>
		</FormLayout>
	);
};

PersonalInfoForm.displayName = "Personal Info";

export default PersonalInfoForm;
