import { useParams } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import TagsInputForm from "@/components/tags-input-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";

import FormLayout from "@/app/layouts/form-layout";
import { updateResumeInfoAction } from "./actions/update-resume-info-action";
import { useResumeContext } from "./context/resume-context";

const ResumeInfoForm = () => {
	const { id } = useParams<{ id: string }>();
	const jobDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
	const { additionalInfo, setAdditionalInfo } = useResumeContext();
	const resume = useResumeStore((state) => state.resume)!;
	const updateResume = useResumeStore((state) => state.update);
	const form = useForm<Partial<TResume>>({
		defaultValues: resume,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;

	const { mutate: updateResumeInfo, isPending } = useMutation({
		mutationKey: ["updateResumeInfo"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateResumeInfoAction(data, id);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (data: TResume) => {
			const appendedResume = {
				resumeName: data.resumeName,
				tags: data.tags,
			};
			updateResume(appendedResume);
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: Partial<TResume>) => {
		const updatedJobDescription = jobDescriptionRef.current?.value || "";
		updateResumeInfo(data);
		setAdditionalInfo((prev) => ({
			...prev,
			jobDescription: updatedJobDescription,
		}));
	};

	return (
		<FormLayout>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FormItem>
						<FormLabel>Resume Name</FormLabel>
						<FormControl>
							<Input {...register("resumeName")} />
						</FormControl>
						{errors.resumeName && <FormMessage>{errors.resumeName.message}</FormMessage>}
					</FormItem>
					<TagsInputForm form={form} name={`tags`} label="Tags" placeholder="Enter a tag and press Enter" />
					<FormControl>
						<Textarea defaultValue={additionalInfo.jobDescription} ref={jobDescriptionRef} placeholder="Enter Job Description" />
					</FormControl>
					<Button loading={isPending} type="submit" className="w-full">
						Update
					</Button>
				</form>
			</Form>
		</FormLayout>
	);
};

ResumeInfoForm.displayName = "Resume Info";

export default ResumeInfoForm;
