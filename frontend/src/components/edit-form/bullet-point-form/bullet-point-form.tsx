"use client";
import { useCallback } from "react";
import { ArrayPath, FieldArray, FieldValues, Path, PathValue, useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { BulletPointFormItem } from "@/components/edit-form/bullet-point-form/bullet-point-form-item";
import { Button } from "@/components/ui/button";
import { EnhanceBulletPointListRequest } from "@/services/bullet-points/enhance-bullet-points";
import { BulletPointDto } from "@/types/bullet-point";
import { useMutation } from "@tanstack/react-query";

import { EnhanceTypes } from "@/types/common";
import { useResumeContext } from "../resume-info-form/context/resume-context";
import { enhanceBulletpointListAction } from "./actions/enhance-bullet-point-list-action";

interface BulletPointsFormProps<T extends FieldValues> {
	form: UseFormReturn<T, ArrayPath<T>, undefined>;
	name: ArrayPath<T>;
	enhanceType?: EnhanceTypes
}

export function BulletPointsForm<T extends FieldValues>({ form, name, enhanceType: enhanceType }: BulletPointsFormProps<T>) {
	const { control, getValues, setValue } = form;
	const { fields, prepend, remove } = useFieldArray({
		control,
		name,
	});
	const { additionalInfo } = useResumeContext();

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
		<div className="space-y-4">
			{enhanceType ? (
				<div className="grid grid-cols-2 gap-3">
					<Button loading={isPending} variant="outline" type="button" onClick={enhanceBulletPoints} className="w-full">
						Enhance With AI
					</Button>
					<Button variant="secondary" type="button" disabled={isPending} onClick={handlePrepend} className="w-full">
						+ Add Bullet Point
					</Button>
				</div>
			) : (
				<Button variant="secondary" type="button" onClick={handlePrepend} className="w-full">
					+ Add Bullet Point
				</Button>
			)}

			<div className="flex flex-col gap-6 mt-3">
				{fields.map((field, index) => (
					<BulletPointFormItem key={field.id} control={control} fieldName={`${name}.${index}.text` as Path<T>} onRemove={() => remove(index)} />
				))}
			</div>
		</div>
	);
}
