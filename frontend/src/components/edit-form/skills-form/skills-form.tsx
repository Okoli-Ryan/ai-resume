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
import { ArrowUpDown, GripVertical } from "lucide-react";
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
					<div className="grid md:grid-cols-2 gap-3 mb-3">
						{skillsList.length > 1 && (
							<Button disabled={isPending} variant="outline" type="button" onClick={() => setInSortMode(!inSortMode)} className="w-full">
								Sort
								<ArrowUpDown />
							</Button>
						)}
						<Button loading={isEnhancing} variant="outline" type="button" onClick={enhanceSkills} className="w-full">
							Generate With AI
						</Button>
						<Button
							type="button"
							variant="outline"
							className="tw-w-max"
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
							Add Category
						</Button>
					</div>
					{inSortMode && (
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
								<div key={field.id} className={cn("bg-white p-2 border rounded-md flex items-center justify-between", inSortMode && "shake")}>
									<span className="capitalize text-sm">{field.category}</span>
									<GripVertical className="text-sm drag-handle cursor-grab text-gray-500" />
								</div>
							))}
						</ReactSortable>
					)}
					{!inSortMode &&
						fields.map((skill, index) => (
							<Fragment key={skill.id}>
								<Card>
									<CardContent className="py-4 flex flex-col gap-4">
										<div>
											<FormLabel htmlFor={`${skill.category}${index}`}>Category</FormLabel>
											<Input
												id={`${skill.category}${index}`}
												{...register(`skills.${index}.category`, {
													required: "Category is required",
												})}
											/>
										</div>

										<TagsInputForm form={form} name={`skills.${index}.skills`} label="Skills" placeholder="Type a skill and press Enter" />
									</CardContent>
								</Card>

								<Button variant="destructive" onClick={() => remove(index)}>
									Remove Skill Category
								</Button>
							</Fragment>
						))}

					<Button loading={isPending} type="submit" className="w-full">
						Update
					</Button>
				</form>
			</Form>
		</FormLayout>
	);
};

SkillsForm.displayName = "Skills";

export default SkillsForm;
