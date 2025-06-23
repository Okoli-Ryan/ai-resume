import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import TagsInputForm from "@/components/tags-input-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";

import { updateResumeInfoAction } from "./actions/update-resume-info-action";

const ResumeInfoForm = () => {
	const { id } = useParams<{ id: string }>();
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
		updateResumeInfo(data);
	};

	return (
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
				<Button loading={isPending} type="submit" className="w-full">
					Update
				</Button>
			</form>
		</Form>
	);
};

ResumeInfoForm.displayName = "Resume Info";

export default ResumeInfoForm;
