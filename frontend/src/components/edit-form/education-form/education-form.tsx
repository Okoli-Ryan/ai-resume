"use client";

import { useParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";

import FormLayout from "@/app/layouts/form-layout";
import { cn } from "@/lib/utils";
import { ArrowUpDown, GripVertical, Plus } from "lucide-react";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { updateEducationListAction } from "./actions/update-education-list-action";
import EducationFormItem from "./education-form-item";

export const EducationForm = () => {
	const { id } = useParams<{ id: string }>();

	const resume = useResumeStore((state) => state.resume);
	const updateResume = useResumeStore((state) => state.update);
	const [inSortMode, setInSortMode] = useState(false);

	const form = useForm<TResume>({
		defaultValues: resume ?? undefined,
	});
	const { handleSubmit, control, watch, setValue } = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "education",
	});

	const educationList = watch("education") || [];

	const { mutate: updateEducationList, isPending } = useMutation({
		mutationKey: ["updateEducationList"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateEducationListAction(data?.education || [], id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (response) => {
			updateResume({ education: response });
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: Partial<TResume>) => {
		updateEducationList(data);
	};

	return (
		<FormLayout>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Action buttons */}
					<div className="flex flex-wrap gap-3">
						{educationList.length > 1 && (
							<Button 
								disabled={isPending} 
								variant="outline" 
								type="button" 
								onClick={() => setInSortMode(!inSortMode)} 
								className="flex items-center gap-2 hover:bg-primary/5"
							>
								<ArrowUpDown className="h-4 w-4" />
								{inSortMode ? "Done Sorting" : "Reorder Items"}
							</Button>
						)}
						<Button
							type="button"
							variant="secondary"
							className="flex items-center gap-2"
							onClick={() => {
								append({
									degree: "",
									location: "",
									fieldOfStudy: "",
									schoolName: "",
									startDate: new Date().toISOString(),
									endDate: new Date().toISOString(),
									isOngoing: false,
									bulletPoints: [],
									resumeId: "",
									userId: "",
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString(),
									id: "",
								});
							}}>
							<Plus className="h-4 w-4" />
							Add Education
						</Button>
					</div>

					{/* Sort mode view */}
					{inSortMode && (
						<div className="space-y-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
							<p className="text-sm text-muted-foreground mb-3">Drag items to reorder them</p>
							<ReactSortable
								list={educationList}
								setList={(newList) => setValue("education", newList)}
								handle=".drag-handle"
								ghostClass="drag-ghost"
								chosenClass="drag-chosen"
								dragClass="drag-drag"
								animation={200}
								delay={2}
								className="space-y-3">
								{educationList.map((field) => (
									<div 
										key={field.id} 
										className={cn(
											"bg-white p-4 border-2 rounded-lg flex items-center justify-between shadow-sm",
											inSortMode && "shake hover:border-primary/50 transition-colors"
										)}
									>
										<div className="flex-1">
											<p className="font-medium text-sm">{field.schoolName || "Untitled Education"}</p>
											<p className="text-xs text-muted-foreground">{field.degree || "No degree specified"}</p>
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
									<p className="text-muted-foreground mb-4">No education added yet</p>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											append({
												degree: "",
												location: "",
												fieldOfStudy: "",
												schoolName: "",
												startDate: new Date().toISOString(),
												endDate: new Date().toISOString(),
												isOngoing: false,
												bulletPoints: [],
												resumeId: "",
												userId: "",
												createdAt: new Date().toISOString(),
												updatedAt: new Date().toISOString(),
												id: "",
											});
										}}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Education
									</Button>
								</div>
							) : (
								fields.map((education, index) => (
									<EducationFormItem 
										key={education.id} 
										form={form} 
										index={index} 
										remove={remove} 
									/>
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

EducationForm.displayName = "Education";

export default EducationForm;
