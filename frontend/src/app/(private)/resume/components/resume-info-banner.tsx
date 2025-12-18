"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileText, Tag, Briefcase, Sparkles, Edit } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TagsInputForm from "@/components/tags-input-form";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { updateResumeInfoAction } from "@/components/edit-form/resume-info-form/actions/update-resume-info-action";
import { useResumeContext } from "@/components/edit-form/resume-info-form/context/resume-context";

export const ResumeInfoBanner = () => {
	const { id } = useParams<{ id: string }>();
	const [open, setOpen] = useState(false);
	const { additionalInfo, setAdditionalInfo } = useResumeContext();
	const resume = useResumeStore((state) => state.resume)!;
	const updateResume = useResumeStore((state) => state.update);
	const form = useForm<Partial<TResume>>({
		defaultValues: {
			resumeName: resume?.resumeName || "",
			tags: resume?.tags || [],
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = form;

	const { mutate: updateResumeInfo, isPending } = useMutation({
		mutationKey: ["updateResumeInfo"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateResumeInfoAction(data, id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (data: TResume) => {
			const appendedResume = {
				resumeName: data.resumeName,
				tags: data.tags,
			};
			updateResume(appendedResume);
			toast.success("Resume information updated successfully");
			setOpen(false);
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: Partial<TResume>) => {
		const updatedJobDescription = data.jobDescription || "";
		updateResumeInfo(data);
		setAdditionalInfo((prev) => ({
			...prev,
			jobDescription: updatedJobDescription,
		}));
	};

	const hasJobDescription = additionalInfo.jobDescription?.trim().length > 0;
	const tagsCount = resume?.tags?.length || 0;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4">
					<div
						className={`
							bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 
							border-2 border-primary/20 rounded-lg shadow-lg 
							p-4 cursor-pointer transition-all hover:shadow-xl hover:border-primary/30
							backdrop-blur-sm
						`}>
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
									<Sparkles className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
										Customize Your Resume
										{!hasJobDescription && (
											<span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">
												Recommended
											</span>
										)}
									</h3>
									<p className="text-xs text-muted-foreground truncate">
										{hasJobDescription ? (
											<>
												<span className="text-green-600 dark:text-green-400">✓</span> Job description added
												{tagsCount > 0 && ` • ${tagsCount} tag${tagsCount > 1 ? "s" : ""}`}
											</>
										) : (
											"Add job description & tags to get AI-powered suggestions"
										)}
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm" className="flex-shrink-0">
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>
						</div>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<Sparkles className="h-5 w-5 text-primary" />
						Customize Your Resume
					</DialogTitle>
					<DialogDescription>
						Add details about your target role to get better AI-powered suggestions for your resume content.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
						{/* Resume Name */}
						<div className="space-y-4">
							<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Resume Details
							</h4>
							<FormItem>
								<FormLabel className="text-sm font-medium">Resume Name</FormLabel>
								<FormControl>
									<Input
										{...register("resumeName")}
										placeholder="e.g., Software Engineer Resume"
										className="transition-all focus:ring-2 focus:ring-primary/20"
									/>
								</FormControl>
								{errors.resumeName && <FormMessage>{errors.resumeName.message}</FormMessage>}
							</FormItem>
						</div>

						{/* Tags */}
						<div className="space-y-4 pt-4 border-t border-border">
							<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
								<Tag className="h-4 w-4" />
								Tags
							</h4>
							<TagsInputForm
								form={form}
								name={`tags`}
								label="Keywords & Tags"
								placeholder="Enter a tag and press Enter"
							/>
							<p className="text-xs text-muted-foreground">Add relevant keywords to help organize and search your resume</p>
						</div>

						{/* Job Description */}
						<div className="space-y-4 pt-4 border-t border-border">
							<div className="flex items-start justify-between">
								<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
									<Briefcase className="h-4 w-4" />
									Target Job Description
								</h4>
								{!hasJobDescription && (
									<span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
										Recommended
									</span>
								)}
							</div>
							<FormControl>
								<Textarea
									{...register("jobDescription")}
									defaultValue={additionalInfo.jobDescription}
									placeholder="Paste the job description here to help AI tailor your resume...

Example:
• Required skills and technologies
• Job responsibilities and requirements
• Company culture and values"
									className="min-h-[180px] transition-all focus:ring-2 focus:ring-primary/20 font-mono text-sm"
									onChange={(e) => setValue("jobDescription", e.target.value)}
								/>
							</FormControl>
							<div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
								<Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
								<p className="text-xs text-blue-700 dark:text-blue-300">
									<strong>Pro tip:</strong> Adding a job description helps AI features generate more relevant bullet
									points, enhance your summary, and optimize your resume for the target role.
								</p>
							</div>
						</div>

						<div className="flex gap-3 pt-4">
							<Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button loading={isPending} type="submit" className="flex-1">
								{isPending ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
