"use client";

import { useParams } from "next/navigation";
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useResumeStore } from '@/store/resume-store';
import { TResume } from '@/types/resume';
import { useMutation } from "@tanstack/react-query";

import { updateEducationListAction } from "./actions/update-education-list-action";
import EducationFormItem from './education-form-item';

export const EducationForm = () => {
	const { id } = useParams<{ id: string }>();

	const resume = useResumeStore((state) => state.resume);
	const updateResume = useResumeStore((state) => state.update);
	const updateResumeDraft = useResumeStore((state) => state.updateDraft);
	const form = useForm<TResume>({
		defaultValues: resume ?? undefined,
	});
	const { handleSubmit, control } = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "education",
	});

	const { mutate: updateEducationList, isPending } = useMutation({
		mutationKey: ["updateEducationList"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateEducationListAction(data?.education || [], id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (response) => {
			updateResume({ education: response });
			updateResumeDraft({ education: response });
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: Partial<TResume>) => {
		updateEducationList(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{fields.map((education, index) => (
					<EducationFormItem key={education.id} form={form} index={index} remove={remove} />
				))}

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
						});
					}}>
					Add Education
				</Button>
				<Button loading={isPending} type="submit" className="w-full">
					Update
				</Button>
			</form>
		</Form>
	);
};

EducationForm.displayName = "Education";

export default EducationForm;
