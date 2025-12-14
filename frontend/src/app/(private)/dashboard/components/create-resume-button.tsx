"use client";

import { Plus } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Routes } from "@/lib/routes";
import { GenerateResumeFromPromptRequest } from "@/services/resume/generate-resume-from-prompt";
import { useResumeStore } from "@/store/resume-store";
import { createResumeAction } from "../actions/create-resume-action";
import { generateResumeFromPromptAction } from "../actions/generate-resume-from-prompt-action";

type CreateMode = "prompt" | "scratch";

const CreateResumeButton = () => {
	const clearResume = useResumeStore((state) => state.clear);
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<CreateMode>("prompt");
	const router = useRouter();

	const form = useForm<GenerateResumeFromPromptRequest>({
		defaultValues: {
			prompt: "",
			additionalInfo: {
				jobDescription: "",
				role: "",
				tags: "",
			},
		},
	});

	const createFromScratch = () => {
		startTransition(async () => {
			const response = await createResumeAction({});

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			clearResume();
			setOpen(false);
			form.reset();
			router.push(Routes.editResume(response.data.id));
		});
	};

	const generateFromPrompt = () => {
		const payload = form.getValues();

		startTransition(async () => {
			const response = await generateResumeFromPromptAction(payload);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			clearResume();
			setOpen(false);
			form.reset();
			router.push(Routes.editResume(response.data.id));
		});
	};

	const handleSubmit = () => {
		if (mode === "scratch") {
			createFromScratch();
		} else {
			generateFromPrompt();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 shadow-sm">
					<Plus className="w-4 h-4 mr-2" />
					Create Resume
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Create Resume</DialogTitle>
					<DialogDescription>Choose how you want to create your resume.</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					{/* Radio Group */}
					<div className="space-y-3">
						<Label>Creation Mode</Label>
						<div className="flex flex-col space-y-2">
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="radio"
									name="mode"
									value="prompt"
									checked={mode === "prompt"}
									onChange={() => setMode("prompt")}
									className="w-4 h-4 text-primary"
								/>
								<span className="text-sm">Generate from prompt</span>
							</label>
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="radio"
									name="mode"
									value="scratch"
									checked={mode === "scratch"}
									onChange={() => setMode("scratch")}
									className="w-4 h-4 text-primary"
								/>
								<span className="text-sm">Create from scratch</span>
							</label>
						</div>
					</div>

					{/* Form - Only show when mode is "prompt" */}
					{mode === "prompt" && (
						<Form {...form}>
							<div className="space-y-4">
								{/* Prompt */}
								<FormField
									control={form.control}
									name="prompt"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tell us about yourself</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe your experience, skills, and career goals... (e.g., I'm a software engineer with 5 years of experience in React and Node.js, passionate about building scalable web applications...)"
													className="min-h-[120px] resize-none"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								{/* Job Description */}
								<FormField
									control={form.control}
									name="additionalInfo.jobDescription"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Job Description (optional)</FormLabel>
											<FormControl>
												<Textarea placeholder="Paste the job description here..." className="min-h-[100px] resize-none" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>

								{/* Role */}
								<FormField
									control={form.control}
									name="additionalInfo.role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role (optional)</FormLabel>
											<FormControl>
												<Input placeholder="e.g., Software Engineer, Product Manager" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>

							</div>
						</Form>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} loading={isPending}>
						{mode === "scratch" ? "Create Resume" : "Generate Resume"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateResumeButton;
