"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormItem } from "@/components/ui/form";
import { DEFAULT_RESUME_ORDER } from "@/lib/constants";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useMutation } from "@tanstack/react-query";
import { GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { ReactSortable } from "react-sortablejs";
import { toast } from "sonner";
import { updateResumeOrderAction } from "./actions/update-resume-order-action";

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
		<Card>
			<CardContent className="py-4 flex flex-col gap-4">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<FormItem>
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
								className="space-y-3">
								{order.map((sectionKey) => (
									<li key={sectionKey} className="bg-white p-2 border rounded-md flex items-center justify-between">
										<span className="capitalize text-sm">{sectionKey}</span>
										<GripVertical className="text-sm drag-handle cursor-grab text-gray-500" />
									</li>
								))}
							</ReactSortable>
						</FormItem>
						<Button loading={isPending} type="submit" className="w-full">
							Update Order
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

ResumeOrderForm.displayName = "Re-arrange";

export default ResumeOrderForm;
