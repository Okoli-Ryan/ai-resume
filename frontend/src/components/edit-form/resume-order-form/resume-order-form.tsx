"use client";
import FormLayout from "@/app/layouts/form-layout";
import { Button } from "@/components/ui/button";
import { Form, FormItem } from "@/components/ui/form";
import { DEFAULT_RESUME_ORDER } from "@/lib/constants";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";
import { GripVertical, ListOrdered } from "lucide-react";
import { useForm } from "react-hook-form";
import { ReactSortable } from "react-sortablejs";
import { toast } from "sonner";
import { updateResumeOrderAction } from "./actions/update-resume-order-action";
import { cn } from "@/lib/utils";

const ResumeOrderForm = () => {
	const resume = useResumeStore((state) => state.resume)!;
	const updateResume = useResumeStore((state) => state.update);

	const form = useForm({
		defaultValues: { ...resume, order: resume.order ? resume.order.split(",") : [...DEFAULT_RESUME_ORDER] },
	});

	const { handleSubmit, setValue, watch } = form;
	const order = watch("order");
	const orderedList = order.map((key) => ({ id: key }));

	const { mutate: updateResumeOrder, isPending } = useMutation({
		mutationKey: ["updateResumeInfo"],
		mutationFn: async (data: Partial<TResume>) => {
			const response = await updateResumeOrderAction(data, resume.id!);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (data: TResume) => {
			const appendedResume = {
				order: data.order,
			};
			updateResume(appendedResume);
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const onSubmit = (data: { order: string[] }) => {
		updateResumeOrder({ ...data, order: data.order.join(",") });
	};

	return (
		<FormLayout>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div className="space-y-4">
						<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
							<ListOrdered className="h-4 w-4" />
							Section Order
						</h4>
						<p className="text-sm text-muted-foreground">
							Drag sections to rearrange their order on your resume
						</p>
					</div>

					<FormItem>
						<div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
							<ReactSortable
								tag="ul"
								list={orderedList}
								setList={(newOrder) =>
									setValue(
										"order",
										newOrder.map((item) => item.id)
									)
								}
								handle=".drag-handle"
								ghostClass="drag-ghost"
								animation={200}
								className="space-y-3">
								{order.map((sectionKey, index) => (
									<li 
										key={sectionKey} 
										className={cn(
											"bg-white p-4 border-2 rounded-lg flex items-center justify-between shadow-sm",
											"shake hover:border-primary/50 transition-colors"
										)}
									>
										<div className="flex items-center gap-3">
											<span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
												{index + 1}
											</span>
											<span className="capitalize font-medium text-sm">{sectionKey}</span>
										</div>
										<GripVertical className="h-5 w-5 drag-handle cursor-grab text-muted-foreground hover:text-primary transition-colors" />
									</li>
								))}
							</ReactSortable>
						</div>
					</FormItem>

					<Button 
						loading={isPending} 
						type="submit" 
						className="w-full h-11 font-medium transition-all hover:shadow-md"
					>
						{isPending ? "Saving..." : "Save Order"}
					</Button>
				</form>
			</Form>
		</FormLayout>
	);
};

ResumeOrderForm.displayName = "Re-arrange";

export default ResumeOrderForm;
