"use client";

import { useParams } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import ErrorLabel from "@/components/error-label";
import { ReactQuill } from "@/components/react-quill";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";

import { updatePersonalInfoAction } from "./actions/update-personal-info-action";

const MAX_LENGTH = 1000;

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
		<FormProvider {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<Label htmlFor="name">Name</Label>
					<Input id="name" {...register("userName")} />
					<ErrorLabel control={control} name="userName" />
				</div>

				<div>
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" {...register("email")} />
					<ErrorLabel control={control} name="email" />
				</div>
				<div>
					<Label htmlFor="phoneNumber">Phone Number</Label>
					<Input id="phoneNumber" {...register("phoneNumber")} />
					<ErrorLabel control={control} name="phoneNumber" />
				</div>
				<div>
					<Label htmlFor="githubUrl">GitHub URL</Label>
					<Input id="githubUrl" {...register("githubUrl")} />
					<ErrorLabel control={control} name="githubUrl" />
				</div>
				<div>
					<Label htmlFor="linkedinUrl">LinkedIn URL</Label>
					<Input id="linkedinUrl" {...register("linkedinUrl")} />
					<ErrorLabel control={control} name="linkedinUrl" />
				</div>
				<Controller
					name="summary"
					control={control}
					render={({ field: { onChange, value } }) => (
						<FormItem>
							<Label htmlFor="linkedinUrl">Summary</Label>
							<FormControl>
								<ReactQuill
									theme="snow"
									value={value}
									onChange={(v) => {
										if (!v) return;
										if (v.replace(/(<([^>]+)>)/gi, "").length <= MAX_LENGTH) {
											onChange(v);
										}
									}}
								/>
							</FormControl>
							<FormMessage />
							<div className="text-right text-sm text-gray-500">
								{(value || "").replace(/(<([^>]+)>)/gi, "").length} / {MAX_LENGTH}
							</div>
						</FormItem>
					)}
				/>
				<div>
					<Label htmlFor="portfolioUrl">Portfolio URL</Label>
					<Input id="portfolioUrl" {...register("portfolioUrl")} />
					<ErrorLabel control={control} name="portfolioUrl" />
				</div>
				<div>
					<Label htmlFor="location">Location</Label>
					<Input id="location" {...register("address")} />
					<ErrorLabel control={control} name="address" />
				</div>
				<div>
					<Label htmlFor="role">Role</Label>
					<Input id="role" {...register("role")} />
					<ErrorLabel control={control} name="role" />
				</div>
				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? "Submitting..." : "Update"}
				</Button>
			</form>
		</FormProvider>
	);
};

PersonalInfoForm.displayName = "Personal Info";

export default PersonalInfoForm;
