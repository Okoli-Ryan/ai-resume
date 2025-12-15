"use client";

import { useParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { ArrowUpDown, GripVertical, Plus } from "lucide-react";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { updateProjectListAction } from "./actions/update-project-list-action";
import ProjectsFormItem from "./projects-form-item";

export const ProjectForm = () => {
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
		name: "projects",
	});

	const projectsList = watch("projects") || [];

	const { mutate: updateProjects, isPending } = useMutation({
		mutationKey: ["updateProjects"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateProjectListAction(data?.projects || [], id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (response) => {
			updateResume({ projects: response });
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: Partial<TResume>) => {
		updateProjects(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Action buttons */}
				<div className="flex flex-wrap gap-3">
					{projectsList.length > 1 && (
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
								name: "",
								link: "",
								resumeId: "",
								userId: "",
								bulletPoints: [],
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
								id: "",
							});
						}}>
						<Plus className="h-4 w-4" />
						Add Project
					</Button>
				</div>

				{/* Sort mode view */}
				{inSortMode && (
					<div className="space-y-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
						<p className="text-sm text-muted-foreground mb-3">Drag items to reorder them</p>
						<ReactSortable
							list={projectsList}
							setList={(newList) => setValue("projects", newList)}
							handle=".drag-handle"
							ghostClass="drag-ghost"
							chosenClass="drag-chosen"
							dragClass="drag-drag"
							animation={200}
							delay={2}
							className="space-y-3">
							{projectsList.map((field) => (
								<div 
									key={field.id} 
									className={cn(
										"bg-white p-4 border-2 rounded-lg flex items-center justify-between shadow-sm",
										inSortMode && "shake hover:border-primary/50 transition-colors"
									)}
								>
									<div className="flex-1">
										<p className="font-medium text-sm">{field.name || "Untitled Project"}</p>
										<p className="text-xs text-muted-foreground">{field.link || "No link provided"}</p>
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
								<p className="text-muted-foreground mb-4">No projects added yet</p>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										append({
											name: "",
											link: "",
											resumeId: "",
											userId: "",
											bulletPoints: [],
											createdAt: new Date().toISOString(),
											updatedAt: new Date().toISOString(),
											id: "",
										});
									}}>
									<Plus className="h-4 w-4 mr-2" />
									Add Your First Project
								</Button>
							</div>
						) : (
							fields.map((project, index) => (
								<ProjectsFormItem 
									key={project.id} 
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
	);
};

ProjectForm.displayName = "Projects";

export default ProjectForm;
