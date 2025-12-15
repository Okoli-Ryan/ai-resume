"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LinkFormItemProps<T extends FieldValues> {
	control: Control<T>;
	inSortMode: boolean;
	nameFieldName: Path<T>;
	urlFieldName: Path<T>;
	onRemove: () => void;
}

export function LinkFormItem<T extends FieldValues>({ 
	control, 
	nameFieldName, 
	urlFieldName, 
	onRemove, 
	inSortMode 
}: LinkFormItemProps<T>) {
	return (
		<FormItem className={cn(
			"flex flex-col relative rounded-lg border border-border bg-card p-4 transition-all", 
			inSortMode && "shake border-primary/30"
		)}>
			<GripVertical
				className={cn(
					"text-sm absolute top-4 z-20 right-4 drag-handle cursor-grab text-muted-foreground hover:text-primary transition-all",
					inSortMode ? "opacity-100" : "opacity-0 pointer-events-none"
				)}
			/>
			<div className="space-y-3">
				<FormField
					control={control}
					name={nameFieldName}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Link Name</FormLabel>
							<FormControl>
								<Input placeholder="e.g., GitHub, LinkedIn, Portfolio" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={urlFieldName}
					render={({ field }) => (
						<FormItem>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input placeholder="https://example.com" type="url" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<Button 
				className="w-max mt-3 flex items-center gap-2" 
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
