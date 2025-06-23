"use client";
import 'react-quill-new/dist/quill.snow.css';

import { useParams } from "next/navigation";
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useResumeStore } from '@/store/resume-store';
import { TResume } from '@/types/resume';
import { useMutation } from "@tanstack/react-query";

import { updateWorkExperienceListAction } from "./actions/update-work-experience-list-action";
import WorkExperienceFormItem from './work-experience-form-item';

const WorkExperienceForm = () => {
	const { id } = useParams<{ id: string }>();
	const resume = useResumeStore((state) => state.resume);
	const updateResume = useResumeStore((state) => state.update);
	const updateResumeDraft = useResumeStore((state) => state.updateDraft);

	const form = useForm<TResume>({
		defaultValues: resume ? resume : undefined,
	});

	const { control, handleSubmit } = form;

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
			updateResumeDraft({ workExperience: response });
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
				{fields.map((experience, index) => (
					<WorkExperienceFormItem key={experience.id} form={form} index={index} remove={remove} />
				))}

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
