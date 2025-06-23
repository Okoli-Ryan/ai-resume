"use client";
import { useParams } from 'next/navigation';
import { Fragment } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import TagsInputForm from '@/components/tags-input-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/store/resume-store';
import { TResume } from '@/types/resume';
import { useMutation } from '@tanstack/react-query';

import { updateSkillsListAction } from './actions/update-skills-list-action';

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
	const form = useForm<Partial<TResume>>({
		defaultValues: resume ?? undefined,
	});

	const { handleSubmit, control, register } = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "skills",
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

	const onSubmit = (data: Partial<TResume>) => {
		updateSkills(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{fields.map((skill, index) => (
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

				<Button
					type="button"
					variant="outline"
					className="tw-w-max"
					onClick={() => {
						append({ category: "", skills: "", resumeId: "", userId: "" });
					}}>
					Add Skill Category
				</Button>
				<Button loading={isPending} type="submit" className="w-full">
					Update
				</Button>
			</form>
		</Form>
	);
};

SkillsForm.displayName = "Skills";

export default SkillsForm;
