"use client";

import { useParams } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useResumeStore } from '@/store/resume-store';
import { TResume } from '@/types/resume';
import { useMutation } from '@tanstack/react-query';

import { updateProjectListAction } from './actions/update-project-list-action';
import ProjectsFormItem from './projects-form-item';

export const ProjectForm = () => {
    const { id } = useParams<{ id: string }>();
	const resume = useResumeStore((state) => state.resume);
    const updateResume = useResumeStore(state => state.update)
    const updateResumeDraft = useResumeStore((state) => state.updateDraft);
	const form = useForm<TResume>({
		defaultValues: resume ?? undefined,
	});

	const { handleSubmit, control } = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "projects",
	});

	const { mutate: updateProjects, isPending } = useMutation({
		mutationKey: ["updateProjects"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateProjectListAction(data?.projects || [], id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (response) => {
			updateResume({ projects: response });
			updateResumeDraft({ projects: response });
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
				{fields.map((project, index) => (
					<ProjectsFormItem key={project.id} form={form} index={index} remove={remove} />
				))}

				{/* Add Project Button */}
				<Button
					type="button"
					variant="outline"
					className="tw-w-max"
					onClick={() => {
						append({ name: "", link: "", resumeId: "", userId: "", bulletPoints: [] });
					}}>
					Add Project
				</Button>

				{/* Submit Button */}
				<Button loading={isPending} type="submit" className="w-full">
					Save
				</Button>
			</form>
		</Form>
	);
};

ProjectForm.displayName = "Projects";

export default ProjectForm;
