"use client";

import { useParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
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
		<Card>
			<CardContent className="py-4 flex flex-col gap-4">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							{educationList.length > 1 && (
								<Button disabled={isPending} variant="outline" type="button" onClick={() => setInSortMode(!inSortMode)} className="w-full">
									Toggle Sort Mode
								</Button>
							)}
						</div>
						{inSortMode && (
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
									<div key={field.id} className={cn("bg-white p-2 border rounded-md flex items-center justify-between", inSortMode && "shake")}>
										<span className="capitalize text-sm">{field.schoolName}</span>
										<GripVertical className="text-sm drag-handle cursor-grab text-gray-500" />
									</div>
								))}
							</ReactSortable>
						)}
						{!inSortMode && fields.map((education, index) => <EducationFormItem key={education.id} form={form} index={index} remove={remove} />)}

						<Button
							type="button"
							variant="outline"
							className="tw-w-max"
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
							Add Education
						</Button>
						<Button loading={isPending} type="submit" className="w-full">
							Update
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

EducationForm.displayName = "Education";

export default EducationForm;
