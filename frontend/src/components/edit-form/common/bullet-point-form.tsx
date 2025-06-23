"use client";
import { useCallback } from 'react';
import {
	ArrayPath, FieldArray, FieldValues, Path, useFieldArray, UseFormReturn
} from 'react-hook-form';

import { BulletPointFormItem } from '@/components/bullet-point-form-item';
import { Button } from '@/components/ui/button';

interface BulletPointsFormProps<T extends FieldValues> {
	form: UseFormReturn<T, ArrayPath<T>, undefined>;
	name: ArrayPath<T>;
}

export function BulletPointsForm<T extends FieldValues>({ form, name }: BulletPointsFormProps<T>) {
	const { control } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name,
	});

    const handleAppend = useCallback(() => {
		append({ text: "" } as FieldArray<T>);
	}, [append]);

	return (
		<div className="space-y-4">
			{fields.map((field, index) => (
				<BulletPointFormItem key={field.id} control={control} fieldName={`${name}.${index}.text` as Path<T>} onRemove={() => remove(index)} />
			))}

			<Button variant="secondary" type="button" onClick={handleAppend} className="w-full">
				+ Add Bullet Point
			</Button>
		</div>
	);
}
