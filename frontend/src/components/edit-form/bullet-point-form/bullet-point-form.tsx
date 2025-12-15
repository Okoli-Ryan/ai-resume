"use client";
import { useCallback, useState } from "react";
import { ArrayPath, FieldArray, FieldValues, Path, PathValue, useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { BulletPointFormItem } from "@/components/edit-form/bullet-point-form/bullet-point-form-item";
import { Button } from "@/components/ui/button";
import { EnhanceBulletPointListRequest } from "@/services/bullet-points/enhance-bullet-points";
import { BulletPointDto } from "@/types/bullet-point";
import { useMutation } from "@tanstack/react-query";

import { FormLabel } from "@/components/ui/form";
import { EnhanceTypes } from "@/types/common";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { ArrowUpDown, ChevronDown, Plus, Sparkles } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useResumeContext } from "../resume-info-form/context/resume-context";
import { enhanceBulletpointListAction } from "./actions/enhance-bullet-point-list-action";

interface BulletPointsFormProps<T extends FieldValues> {
	form: UseFormReturn<T, ArrayPath<T>, T>;
	name: ArrayPath<T>;
	enhanceType?: EnhanceTypes;
}

export function BulletPointsForm<T extends FieldValues>({ form, name, enhanceType: enhanceType }: BulletPointsFormProps<T>) {
	const { control, getValues, setValue, watch } = form;
	const { prepend, remove } = useFieldArray({
		control,
		name,
	});
	const { additionalInfo } = useResumeContext();
	const [inSortMode, setInSortMode] = useState(false);

    const bulletPointsList = watch(name as Path<T>) || [] as PathValue<T, Path<T>> 

	const { mutate, isPending } = useMutation({
		mutationKey: ["enhance-bullet-points"],
		mutationFn: async () => {
			const bulletPoints = getValues(name as Path<T>) as BulletPointDto[];
			const tags = getValues("tags" as Path<T>) as string;
			const role = getValues("role" as Path<T>) as string;

			const bulletpointTexts = bulletPoints.map((point) => point.text);

			const payload: EnhanceBulletPointListRequest = {
				bulletPoints: bulletpointTexts,
				additionalInfo: {
					jobDescription: additionalInfo.jobDescription || "",
					tags,
					role,
				},
			};

			const response = await enhanceBulletpointListAction(payload, enhanceType!);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			setValue(name as Path<T>, response.data.map((point, index) => ({ text: point, order: index })) as PathValue<T, Path<T>>);
		},
	});

	const enhanceBulletPoints = () => mutate();

	const handlePrepend = useCallback(() => {
		prepend({ text: "" } as FieldArray<T>);
	}, [prepend]);

	return (
		<Accordion transition transitionTimeout={200}>
			<AccordionItem
				buttonProps={{
					className: "flex justify-between items-center w-full border-2 border-border rounded-lg px-4 py-3 cursor-pointer transition-all hover:bg-muted/30 hover:border-primary/30",
				}}
				contentProps={{ className: "transition-all duration-200 ease-in-out" }}
				header={
					<>
						<FormLabel className="cursor-pointer font-semibold text-sm">
							Responsibilities & Achievements
						</FormLabel>
						<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
					</>
				}>
				<div className="space-y-4 mt-4 p-4 bg-muted/10 rounded-lg">
					{/* Action buttons */}
					<div className="flex flex-wrap gap-2">
						{enhanceType && (
							<Button 
								loading={isPending} 
								variant="outline" 
								type="button" 
								onClick={enhanceBulletPoints} 
								className="flex items-center gap-2 hover:bg-primary/5"
							>
								<Sparkles className="h-4 w-4" />
								{isPending ? "Generating..." : "Generate with AI"}
							</Button>
						)}
						{bulletPointsList.length > 1 && (
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
							Add Point
						</Button>
					</div>

					{/* Bullet points list */}
					<div className="flex flex-col gap-4 mt-4">
						{bulletPointsList.length === 0 ? (
							<div className="text-center py-8 px-4 border-2 border-dashed rounded-lg bg-background">
								<p className="text-sm text-muted-foreground mb-3">No bullet points added yet</p>
								<Button
									variant="outline"
									type="button"
									onClick={handlePrepend}
									className="flex items-center gap-2"
								>
									<Plus className="h-4 w-4" />
									Add Your First Point
								</Button>
							</div>
						) : (
							<ReactSortable
								list={bulletPointsList}
								setList={(newList) => setValue(name as Path<T>, newList as PathValue<T, Path<T>>)}
								handle=".drag-handle"
								ghostClass="drag-ghost"
								animation={200}
								delay={2}
								className="space-y-3">
								{(bulletPointsList as BulletPointDto[]).map((field, index) => (
									<BulletPointFormItem
										key={field.id}
										inSortMode={inSortMode}
										control={control}
										fieldName={`${name}.${index}.text` as Path<T>}
										onRemove={() => remove(index)}
									/>
								))}
							</ReactSortable>
						)}
					</div>
				</div>
			</AccordionItem>
		</Accordion>
	);
}
