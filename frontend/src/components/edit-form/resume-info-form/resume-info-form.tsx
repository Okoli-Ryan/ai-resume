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
import { FileText, Tag, Briefcase } from "lucide-react";

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
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					{/* Resume Name */}
					<div className="space-y-4">
						<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
							<FileText className="h-4 w-4" />
							Resume Details
						</h4>
						<FormItem>
							<FormLabel className="text-sm font-medium">Resume Name</FormLabel>
							<FormControl>
								<Input 
									{...register("resumeName")} 
									placeholder="e.g., Software Engineer Resume"
									className="transition-all focus:ring-2 focus:ring-primary/20"
								/>
							</FormControl>
							{errors.resumeName && <FormMessage>{errors.resumeName.message}</FormMessage>}
						</FormItem>
					</div>

					{/* Tags */}
					<div className="space-y-4 pt-4 border-t border-border">
						<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
							<Tag className="h-4 w-4" />
							Tags
						</h4>
						<TagsInputForm form={form} name={`tags`} label="Keywords & Tags" placeholder="Enter a tag and press Enter" />
						<p className="text-xs text-muted-foreground">Add relevant keywords to help organize and search your resume</p>
					</div>

					{/* Job Description */}
					<div className="space-y-4 pt-4 border-t border-border">
						<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
							<Briefcase className="h-4 w-4" />
							Target Job Description (Optional)
						</h4>
						<FormControl>
							<Textarea 
								defaultValue={additionalInfo.jobDescription} 
								ref={jobDescriptionRef} 
								placeholder="Paste the job description here to help AI tailor your resume..."
								className="min-h-[120px] transition-all focus:ring-2 focus:ring-primary/20"
							/>
						</FormControl>
						<p className="text-xs text-muted-foreground">
							This helps AI features generate more relevant content for your target role
						</p>
					</div>

					<Button 
						loading={isPending} 
						type="submit" 
						className="w-full h-11 font-medium mt-6 transition-all hover:shadow-md"
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</Form>
		</FormLayout>
	);
};

ResumeInfoForm.displayName = "Resume Info";

export default ResumeInfoForm;
