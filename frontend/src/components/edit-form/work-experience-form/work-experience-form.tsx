"use client";
import "react-quill-new/dist/quill.snow.css";

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
import { updateWorkExperienceListAction } from "./actions/update-work-experience-list-action";
import WorkExperienceFormItem from "./work-experience-form-item";

const WorkExperienceForm = () => {
	const { id } = useParams<{ id: string }>();
	const resume = useResumeStore((state) => state.resume);
	const updateResume = useResumeStore((state) => state.update);
	const [inSortMode, setInSortMode] = useState(false);

	const form = useForm<TResume>({
		defaultValues: resume ? resume : undefined,
	});

	const { control, handleSubmit, watch, setValue } = form;

	const workExperienceList = watch("workExperience") || [];

	const { fields, append, remove } = useFieldArray({
		control,
		name: "workExperience",
	});

	const { mutate: updateWorkExperience, isPending } = useMutation({
		mutationKey: ["updateWorkExperience"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateWorkExperienceListAction(data?.workExperience || [], id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (response) => {
			updateResume({ workExperience: response });
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: Partial<TResume>) => {
		updateWorkExperience(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-2 gap-3">
					{workExperienceList.length > 1 && (
						<Button disabled={isPending} variant="outline" type="button" onClick={() => setInSortMode(!inSortMode)} className="w-full">
							Toggle Sort Mode
						</Button>
					)}
				</div>
				{inSortMode && (
					<ReactSortable
						list={workExperienceList}
						setList={(newList) => setValue("workExperience", newList)}
						handle=".drag-handle"
						ghostClass="drag-ghost"
						animation={200}
						delay={2}
						className="space-y-3">
						{workExperienceList.map((field) => (
                                    <div key={field.id} className={cn("bg-white p-2 border rounded-md flex items-center justify-between", inSortMode && "shake")}>
								<span className="capitalize text-sm">{field.companyName}</span>
								<GripVertical className="text-sm drag-handle cursor-grab text-gray-500" />
							</div>
						))}
					</ReactSortable>
				)}
				{!inSortMode && fields.map((experience, index) => <WorkExperienceFormItem key={experience.id} form={form} index={index} remove={remove} />)}

				<Button
					type="button"
					variant="outline"
					className="tw-w-max"
					onClick={() => {
						append({
							companyName: "",
							endDate: new Date().toISOString(),
							location: "",
							startDate: new Date().toISOString(),
							isOngoing: false,
							resumeId: "",
							title: "",
							userId: "",
							companyLink: "",
							bulletPoints: [],
							workType: "",
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
							id: "",
						});
					}}>
					Add Experience
				</Button>

				<Button loading={isPending} type="submit" className="w-full">
					Update
				</Button>
			</form>
		</Form>
	);
};

WorkExperienceForm.displayName = "Work Experience";

export default WorkExperienceForm;
