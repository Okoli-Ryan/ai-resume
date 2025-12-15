import { ReactQuill } from "@/components/react-quill";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { EnhanceSummaryRequest } from "@/services/resume/enhance-summary";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";
import { Controller, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useResumeContext } from "../resume-info-form/context/resume-context";
import { enhanceSummaryAction } from "./actions/enhance-summary-action";

const MAX_LENGTH = 1000;

const SummaryForm = ({ form }: { form: UseFormReturn<Partial<TResume>, any, Partial<TResume>> }) => {
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
		<div className="space-y-3">
			<Controller
				name="summary"
				control={control}
				render={({ field: { onChange, value } }) => (
					<FormItem>
						<Label htmlFor="summary" className="text-sm font-medium">
							Professional Summary
						</Label>
						<FormControl>
							<div className="rounded-lg border border-input overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20">
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
							</div>
						</FormControl>
						<FormMessage />
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
							<Button 
								type="button" 
								variant="outline" 
								onClick={enhanceSummary} 
								loading={isPending}
								className="flex items-center gap-2 hover:bg-primary/5"
							>
								<Sparkles className="h-4 w-4" />
								{isPending ? "Generating..." : "Generate with AI"}
							</Button>
							<span className="text-right text-xs text-muted-foreground">
								{(value || "").replace(/(<([^>]+)>)/gi, "").length} / {MAX_LENGTH} characters
							</span>
						</div>
					</FormItem>
				)}
			/>
		</div>
	);
};

export default SummaryForm;
