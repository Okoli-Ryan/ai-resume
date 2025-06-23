"use client";

import { Trash } from 'lucide-react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { ReactQuill } from '@/components/react-quill';
import { Button } from '@/components/ui/button';
import { FormItem } from '@/components/ui/form';

interface BulletPointFormItemProps<T extends FieldValues> {
	control: Control<T>;
	fieldName: Path<T>;
	onRemove: () => void;
}

export function BulletPointFormItem<T extends FieldValues>({ control, fieldName, onRemove }: BulletPointFormItemProps<T>) {
	return (
		<FormItem className="flex flex-col gap-4">
			<Controller
				name={fieldName}
				control={control}
				render={({ field }) => (
					<ReactQuill
						className="tw-w-full"
						theme="snow"
						modules={{
							toolbar: ["bold", "italic", "link"],
						}}
						{...field}
					/>
				)}
			/>

			<div className="flex gap-2 items-center">
				<Button variant="destructive" onClick={onRemove}>
					<Trash />
				</Button>
			</div>
		</FormItem>
	);
}
