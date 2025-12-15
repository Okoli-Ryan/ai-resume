"use client";
import { useCallback, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { LinkFormItem } from "@/components/edit-form/link-form/link-form-item";
import { Button } from "@/components/ui/button";
import { LinkDto } from "@/types/link";
import { useMutation } from "@tanstack/react-query";

import { FormLabel } from "@/components/ui/form";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { ArrowUpDown, ChevronDown, Plus } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { updateLinksAction } from "./actions/update-links-action";
import { useParams } from "next/navigation";
import { useResumeStore } from "@/store/resume-store";
import FormLayout from "@/app/layouts/form-layout";

type LinkFormData = {
	links: LinkDto[];
};

export const LinkForm = () => {
	const { id } = useParams<{ id: string }>();
	const resume = useResumeStore((state) => state.resume)!;
	const updateResume = useResumeStore((state) => state.update);
	
	const form = useForm<LinkFormData>({
		defaultValues: {
			links: resume.links || [],
		},
	});

	const { control, setValue, watch, handleSubmit } = form;
	const { fields, prepend, remove } = useFieldArray({
		control,
		name: "links",
	});
	const [inSortMode, setInSortMode] = useState(false);

	const linksList = watch("links") || [];

	const { mutate: saveLinks, isPending } = useMutation({
		mutationKey: ["update-links", id],
		mutationFn: async (data: LinkFormData) => {
			const linksWithIndex = data.links.map((link, index) => ({
				...link,
				index,
			}));

			const response = await updateLinksAction(id, linksWithIndex);

			if (!response.success) throw new Error(response.message);

			return response.data;
		},
		onSuccess: (data: LinkDto[]) => {
			toast.success("Links updated successfully");
			setValue("links", data);
			updateResume({ links: data });
		},
		onError: (error: Error) => {
			toast.error(error?.message);
		},
	});

	const handlePrepend = useCallback(() => {
		prepend({ name: "", url: "", index: 0, resumeId: id, userId: resume.userId || "" } as LinkDto);
	}, [prepend, id, resume.userId]);

	const onSubmit = (data: LinkFormData) => {
		saveLinks(data);
	};

	return (
		<FormLayout>
			<FormProvider {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<Accordion transition transitionTimeout={200}>
						<AccordionItem
							buttonProps={{
								className: "flex justify-between items-center w-full border-2 border-border rounded-lg px-4 py-3 cursor-pointer transition-all hover:bg-muted/30 hover:border-primary/30",
							}}
							contentProps={{ className: "transition-all duration-200 ease-in-out" }}
							header={
								<>
									<FormLabel className="cursor-pointer font-semibold text-sm">
										Links
									</FormLabel>
									<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
								</>
							}>
							<div className="space-y-4 mt-4 p-4 bg-muted/10 rounded-lg">
								{/* Action buttons */}
								<div className="flex flex-wrap gap-2">
									{linksList.length > 1 && (
										<Button 
											disabled={isPending} 
											variant="outline" 
											type="button" 
											onClick={() => setInSortMode(!inSortMode)} 
											className="flex items-center gap-2"
										>
											<ArrowUpDown className="h-4 w-4" />
											{inSortMode ? "Done" : "Reorder"}
										</Button>
									)}
									<Button 
										variant="secondary" 
										type="button" 
										disabled={isPending} 
										onClick={handlePrepend} 
										className="flex items-center gap-2"
									>
										<Plus className="h-4 w-4" />
										Add Link
									</Button>
								</div>

								{/* Links list */}
								<div className="flex flex-col gap-4 mt-4">
									{linksList.length === 0 ? (
										<div className="text-center py-8 px-4 border-2 border-dashed rounded-lg bg-background">
											<p className="text-sm text-muted-foreground mb-3">No links added yet</p>
											<Button
												variant="outline"
												type="button"
												onClick={handlePrepend}
												className="flex items-center gap-2"
											>
												<Plus className="h-4 w-4" />
												Add Your First Link
											</Button>
										</div>
									) : (
										<ReactSortable
											list={linksList}
											setList={(newList) => setValue("links", newList)}
											handle=".drag-handle"
											ghostClass="drag-ghost"
											animation={200}
											delay={2}
											className="space-y-3">
											{fields.map((field, index) => (
												<LinkFormItem
													key={field.id}
													inSortMode={inSortMode}
													control={control}
													nameFieldName={`links.${index}.name`}
													urlFieldName={`links.${index}.url`}
													onRemove={() => remove(index)}
												/>
											))}
										</ReactSortable>
									)}
								</div>
							</div>
						</AccordionItem>
					</Accordion>

					<Button 
						type="submit" 
						className="w-full mt-6 h-11 font-medium transition-all hover:shadow-md" 
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Save Links"}
					</Button>
				</form>
			</FormProvider>
		</FormLayout>
	);
}

LinkForm.displayName = "Custom Links";

export default LinkForm