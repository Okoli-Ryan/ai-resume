import { ReactQuill } from "@/components/react-quill";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { EnhanceSummaryRequest } from "@/services/resume/enhance-summary";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";
import { Controller, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useResumeContext } from "../resume-info-form/context/resume-context";
import { enhanceSummaryAction } from "./actions/enhance-summary-action";

const MAX_LENGTH = 1000;

const SummaryForm = ({ form }: { form: UseFormReturn<Partial<TResume>, any, undefined> }) => {
	const { additionalInfo } = useResumeContext();

	const { getValues, setValue, control } = form;

	const { mutate, isPending } = useMutation({
		mutationKey: ["enhance-summary"],
		mutationFn: async () => {
			const summary = getValues("summary");
			const tags = getValues("tags");
			const role = getValues("role");

			const payload: EnhanceSummaryRequest = {
				summary,
				additionalInfo: {
					jobDescription: additionalInfo.jobDescription || "",
					tags,
					role,
				},
			};

			const response = await enhanceSummaryAction(payload);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			setValue("summary", response.data.summary);
		},
	});

	const enhanceSummary = () => mutate();

	return (
		<div className="mb-4">
			<Controller
				name="summary"
				control={control}
				render={({ field: { onChange, value } }) => (
					<FormItem>
						<Label htmlFor="summary">Summary</Label>
						<FormControl>
							<ReactQuill
								theme="snow"
								value={value}
								onChange={(v) => {
									if (!v) return;
									if (v.replace(/(<([^>]+)>)/gi, "").length <= MAX_LENGTH) {
										onChange(v);
									}
								}}
							/>
						</FormControl>
						<FormMessage />
						<div className="flex justify-between items-center">
							<Button type="button" variant="outline" onClick={enhanceSummary} loading={isPending}>
								Generate Summary
							</Button>
							<span className="text-right text-sm text-gray-500">
								{(value || "").replace(/(<([^>]+)>)/gi, "").length} / {MAX_LENGTH}
							</span>
						</div>
					</FormItem>
				)}
			/>
		</div>
	);
};

export default SummaryForm;
