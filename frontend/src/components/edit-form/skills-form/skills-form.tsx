"use client";
import { useParams } from "next/navigation";
import { Fragment, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import TagsInputForm from "@/components/tags-input-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";

import FormLayout from "@/app/layouts/form-layout";
import { cn } from "@/lib/utils";
import { EnhanceSkillsRequest } from "@/services/resume/enhance-skills";
import { SkillDto } from "@/types/skill";
import { ArrowUpDown, GripVertical, Plus, Sparkles, Trash2 } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useResumeContext } from "../resume-info-form/context/resume-context";
import { enhanceSkillsAction } from "./actions/enhance-skills-action";
import { updateSkillsListAction } from "./actions/update-skills-list-action";

export type TSkillForm = {
	skills: {
		category: string;
		skills: { text: string }[];
	}[];
};

const SkillsForm = () => {
	const { id } = useParams<{ id: string }>();
	const resume = useResumeStore((state) => state.resume);
	const updateResume = useResumeStore((state) => state.update);
	const { additionalInfo } = useResumeContext();
	const [inSortMode, setInSortMode] = useState(false);

	const form = useForm<Partial<TResume>>({
		defaultValues: resume ?? undefined,
	});

	const { handleSubmit, control, register, getValues, setValue, watch } = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "skills",
	});

	const skillsList = watch("skills") || [];

	const { mutate, isPending: isEnhancing } = useMutation({
		mutationKey: ["enhance-summary"],
		mutationFn: async () => {
			const skills = getValues("skills");
			const tags = getValues("tags");
			const role = getValues("role");

			const skillsList = skills?.map((skill) => skill?.skills.split(",")).flat() || [];

			const payload: EnhanceSkillsRequest = {
				skills: skillsList,
				additionalInfo: {
					jobDescription: additionalInfo.jobDescription || "",
					tags,
					role,
				},
			};

			const response = await enhanceSkillsAction(payload);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			const parsedResponse = response.data.map((skill) => ({
				category: skill.category,
				skills: skill.skills.map((s) => s.trim()).join(","),
			}));

			setValue("skills", parsedResponse as SkillDto[]);
		},
	});

	const { mutate: updateSkills, isPending } = useMutation({
		mutationKey: ["updateSkills"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateSkillsListAction(data?.skills || [], id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (response) => {
			updateResume({ skills: response });
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const enhanceSkills = () => mutate();

	const onSubmit = (data: Partial<TResume>) => {
		updateSkills(data);
	};

	return (
		<FormLayout>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Action buttons */}
					<div className="flex flex-wrap gap-3">
						{skillsList.length > 1 && (
							<Button 
								disabled={isPending} 
								variant="outline" 
								type="button" 
								onClick={() => setInSortMode(!inSortMode)} 
								className="flex items-center gap-2 hover:bg-primary/5"
							>
								<ArrowUpDown className="h-4 w-4" />
								{inSortMode ? "Done Sorting" : "Reorder Categories"}
							</Button>
						)}
						<Button 
							loading={isEnhancing} 
							variant="outline" 
							type="button" 
							onClick={enhanceSkills} 
							className="flex items-center gap-2 hover:bg-primary/5"
						>
							<Sparkles className="h-4 w-4" />
							{isEnhancing ? "Generating..." : "Generate with AI"}
						</Button>
						<Button
							type="button"
							variant="secondary"
							className="flex items-center gap-2"
							onClick={() => {
								append({
									category: "",
									skills: "",
									resumeId: "",
									userId: "",
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString(),
									id: "",
								});
							}}>
							<Plus className="h-4 w-4" />
							Add Category
						</Button>
					</div>

					{/* Sort mode view */}
					{inSortMode && (
						<div className="space-y-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
							<p className="text-sm text-muted-foreground mb-3">Drag categories to reorder them</p>
							<ReactSortable
								list={skillsList}
								setList={(newList) => setValue("skills", newList)}
								handle=".drag-handle"
								ghostClass="drag-ghost"
								chosenClass="drag-chosen"
								dragClass="drag-drag"
								animation={200}
								delay={2}
								className="space-y-3">
								{skillsList.map((field) => (
									<div 
										key={field.id} 
										className={cn(
											"bg-white p-4 border-2 rounded-lg flex items-center justify-between shadow-sm",
											inSortMode && "shake hover:border-primary/50 transition-colors"
										)}
									>
										<div className="flex-1">
											<p className="font-medium text-sm">{field.category || "Untitled Category"}</p>
											<p className="text-xs text-muted-foreground">
												{field.skills ? field.skills.split(',').length : 0} skills
											</p>
										</div>
										<GripVertical className="h-5 w-5 drag-handle cursor-grab text-muted-foreground hover:text-primary transition-colors" />
									</div>
								))}
							</ReactSortable>
						</div>
					)}

					{/* Normal edit mode */}
					{!inSortMode && (
						<div className="space-y-4">
							{fields.length === 0 ? (
								<div className="text-center py-12 px-4 border-2 border-dashed rounded-lg bg-muted/10">
									<p className="text-muted-foreground mb-4">No skill categories added yet</p>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											append({
												category: "",
												skills: "",
												resumeId: "",
												userId: "",
												createdAt: new Date().toISOString(),
												updatedAt: new Date().toISOString(),
												id: "",
											});
										}}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Category
									</Button>
								</div>
							) : (
								fields.map((skill, index) => (
									<Fragment key={skill.id}>
										<Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
											<CardContent className="py-5 flex flex-col gap-4">
												<div className="space-y-2">
													<FormLabel htmlFor={`${skill.category}${index}`} className="text-sm font-medium">
														Category Name
													</FormLabel>
													<Input
														id={`${skill.category}${index}`}
														{...register(`skills.${index}.category`, {
															required: "Category is required",
														})}
														placeholder="e.g., Programming Languages, Frameworks"
														className="transition-all focus:ring-2 focus:ring-primary/20"
													/>
												</div>

												<TagsInputForm 
													form={form} 
													name={`skills.${index}.skills`} 
													label="Skills" 
													placeholder="Type a skill and press Enter" 
												/>
											</CardContent>
										</Card>

										<Button 
											variant="destructive" 
											onClick={() => remove(index)}
											className="w-full flex items-center justify-center gap-2"
										>
											<Trash2 className="h-4 w-4" />
											Remove Category
										</Button>
									</Fragment>
								))
							)}
						</div>
					)}

					<Button 
						loading={isPending} 
						type="submit" 
						className="w-full h-11 font-medium mt-6 transition-all hover:shadow-md"
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</Form>
		</FormLayout>
	);
};

SkillsForm.displayName = "Skills";

export default SkillsForm;
