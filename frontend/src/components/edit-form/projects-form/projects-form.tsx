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
import { GripVertical } from "lucide-react";
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
				<div className="grid grid-cols-2 gap-3">
					{projectsList.length > 1 && (
						<Button disabled={isPending} variant="outline" type="button" onClick={() => setInSortMode(!inSortMode)} className="w-full">
							Toggle Sort Mode
						</Button>
					)}
				</div>
				{inSortMode && (
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
							<div key={field.id} className={cn("bg-white p-2 border rounded-md flex items-center justify-between", inSortMode && "shake")}>
								<span className="capitalize text-sm">{field.name}</span>
								<GripVertical className="text-sm drag-handle cursor-grab text-gray-500" />
							</div>
						))}
					</ReactSortable>
				)}
				{!inSortMode && fields.map((project, index) => <ProjectsFormItem key={project.id} form={form} index={index} remove={remove} />)}

				<Button
					type="button"
					variant="outline"
					className="tw-w-max"
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
					Add Project
				</Button>

				{/* Submit Button */}
				<Button loading={isPending} type="submit" className="w-full">
					Update
				</Button>
			</form>
		</Form>
	);
};

ProjectForm.displayName = "Projects";

export default ProjectForm;
