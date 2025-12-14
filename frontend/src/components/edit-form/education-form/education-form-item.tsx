"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TResume } from "@/types/resume";
import { GraduationCap, BookOpen, MapPin, Calendar, Trash2 } from "lucide-react";

import { BulletPointsForm } from "../bullet-point-form/bullet-point-form";
import DateFormItem from "../common/date-form-item";

type EducationFormItemProps = {
	form: UseFormReturn<TResume, any, TResume>;
	index: number;
	remove: UseFieldArrayRemove;
};

const EducationFormItem = ({ index, remove, form }: EducationFormItemProps) => {
	const { control, watch } = form;

	const isOngoing = watch(`education.${index}.isOngoing`);

	return (
		<div className="space-y-5 p-5 border border-border/50 rounded-lg bg-card shadow-sm">
			{/* School Information */}
			<div className="space-y-4">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
					<GraduationCap className="h-4 w-4" />
					School Information
				</h4>
				
				<FormField
					control={control}
					name={`education.${index}.schoolName`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium">School Name</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									placeholder="e.g., Harvard University, MIT"
									className="transition-all focus:ring-2 focus:ring-primary/20"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`education.${index}.location`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium flex items-center gap-2">
								<MapPin className="h-3.5 w-3.5 text-muted-foreground" />
								Location
							</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									placeholder="City, State/Country"
									className="transition-all focus:ring-2 focus:ring-primary/20"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Degree Information */}
			<div className="space-y-4 pt-4 border-t border-border">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
					<BookOpen className="h-4 w-4" />
					Degree Information
				</h4>

				<FormField
					control={control}
					name={`education.${index}.degree`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium">Degree</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									placeholder="e.g., Bachelor of Science, Master's"
									className="transition-all focus:ring-2 focus:ring-primary/20"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`education.${index}.fieldOfStudy`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium">Field of Study</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									placeholder="e.g., Computer Science, Business"
									className="transition-all focus:ring-2 focus:ring-primary/20"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Duration */}
			<div className="space-y-4 pt-4 border-t border-border">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
					<Calendar className="h-4 w-4" />
					Duration
				</h4>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<DateFormItem name={`education.${index}.startDate`} control={control} label="Start Date" />
					<DateFormItem disabled={isOngoing} name={`education.${index}.endDate`} control={control} label="End Date" />
				</div>

				<FormField
					control={control}
					name={`education.${index}.isOngoing`}
					render={({ field }) => (
						<FormItem className="flex items-center gap-3 space-y-0 p-3 bg-muted/30 rounded-md">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<FormLabel className="font-normal cursor-pointer">
								I am currently studying here
							</FormLabel>
						</FormItem>
					)}
				/>
			</div>

			{/* Achievements */}
			<div className="pt-4 border-t border-border">
				<BulletPointsForm form={form} name={`education.${index}.bulletPoints`} />
			</div>

			{/* Remove Button */}
			<Button 
				variant="destructive" 
				onClick={() => remove(index)}
				className="w-full flex items-center justify-center gap-2 mt-4"
			>
				<Trash2 className="h-4 w-4" />
				Remove This Education
			</Button>
		</div>
	);
};

export default EducationFormItem;
