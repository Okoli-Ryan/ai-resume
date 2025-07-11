"use client";

import { GripVertical, Trash } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { ReactQuill } from "@/components/react-quill";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface BulletPointFormItemProps<T extends FieldValues> {
	control: Control<T>;
	inSortMode: boolean;
	fieldName: Path<T>;
	onRemove: () => void;
}

export function BulletPointFormItem<T extends FieldValues>({ control, fieldName, onRemove, inSortMode }: BulletPointFormItemProps<T>) {
	return (
		<FormItem className={cn("flex flex-col relative", inSortMode && "shake")}>
			<GripVertical
				className={`text-sm absolute top-4 z-20 right-4 drag-handle cursor-grab text-gray-500 ml-auto transition-opacity ${
					inSortMode ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			/>
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

			<Button className="w-max" variant="destructive" onClick={onRemove}>
				<Trash />
			</Button>
		</FormItem>
	);
}
