"use client";

import { GripVertical, Trash2 } from "lucide-react";
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
		<FormItem className={cn("flex flex-col relative rounded-lg border border-border bg-card p-3 transition-all", inSortMode && "shake border-primary/30")}>
			<GripVertical
				className={cn(
					"text-sm absolute top-4 z-20 right-4 drag-handle cursor-grab text-muted-foreground hover:text-primary transition-all",
					inSortMode ? "opacity-100" : "opacity-0 pointer-events-none"
				)}
			/>
			<Controller
				name={fieldName}
				control={control}
				render={({ field }) => (
					<div className="rounded-md overflow-hidden border border-input">
						<ReactQuill
							className="tw-w-full"
							theme="snow"
							modules={{
								toolbar: ["bold", "italic", "link"],
							}}
							{...field}
						/>
					</div>
				)}
			/>

			<Button 
				className="w-max mt-2 flex items-center gap-2" 
				size="sm"
				variant="destructive" 
				onClick={onRemove}
			>
				<Trash2 className="h-3.5 w-3.5" />
				Remove
			</Button>
		</FormItem>
	);
}
