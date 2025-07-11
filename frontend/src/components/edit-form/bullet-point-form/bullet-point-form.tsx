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
import { ChevronDown } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useResumeContext } from "../resume-info-form/context/resume-context";
import { enhanceBulletpointListAction } from "./actions/enhance-bullet-point-list-action";

interface BulletPointsFormProps<T extends FieldValues> {
	form: UseFormReturn<T, ArrayPath<T>, undefined>;
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
					className: "flex justify-between items-center w-full border rounded-sm px-2 py-4 cursor-pointer transition hover:bg-gray-100",
				}}
				contentProps={{ className: "transition-all duration-200 ease-in-out" }}
				header={
					<>
						<FormLabel className="cursor-pointer">Toggle Bullet Points</FormLabel>
						<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
					</>
				}>
				<div className="space-y-4 mt-4">
					<div className="grid grid-cols-2 gap-3">
						{enhanceType && (
							<Button loading={isPending} variant="outline" type="button" onClick={enhanceBulletPoints} className="w-full">
								Generate With AI
							</Button>
						)}
						{bulletPointsList.length > 1 && (
							<Button disabled={isPending} variant="outline" type="button" onClick={() => setInSortMode(!inSortMode)} className="w-full">
								Toggle Sort Mode
							</Button>
						)}
						<Button variant="secondary" type="button" disabled={isPending} onClick={handlePrepend} className="w-full">
							+ Add Bullet Point
						</Button>
					</div>

					<div className="flex flex-col gap-6 mt-3">
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
					</div>
				</div>
			</AccordionItem>
		</Accordion>
	);
}
