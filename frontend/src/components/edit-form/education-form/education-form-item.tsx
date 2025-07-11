"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TResume } from "@/types/resume";

import { BulletPointsForm } from "../bullet-point-form/bullet-point-form";
import DateFormItem from "../common/date-form-item";

type EducationFormItemProps = {
	form: UseFormReturn<TResume, any, undefined>;
	index: number;
	remove: UseFieldArrayRemove;
};

const EducationFormItem = ({ index, remove, form }: EducationFormItemProps) => {
	const { control, watch } = form;

	const isOngoing = watch(`education.${index}.isOngoing`);

	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name={`education.${index}.schoolName`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>School Name</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name={`education.${index}.degree`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Degree</FormLabel>
						<FormControl>
							<Input {...field} />
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
						<FormLabel>Field of Study</FormLabel>
						<FormControl>
							<Input {...field} />
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
						<FormLabel>Location</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<DateFormItem name={`education.${index}.startDate`} control={control} label="Start Date" />

			<FormField
				control={control}
				name={`education.${index}.isOngoing`}
				render={({ field }) => (
					<FormItem className="flex items-center gap-2 space-y-0">
						<FormLabel className="font-normal">Is Ongoing?</FormLabel>
						<FormControl>
							<Checkbox checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>

			<DateFormItem disabled={isOngoing} name={`education.${index}.endDate`} control={control} label="End Date" />

			<BulletPointsForm form={form} name={`education.${index}.bulletPoints`} />

			<Button variant="destructive" onClick={() => remove(index)}>
				Remove Education
			</Button>
		</div>
	);
};

export default EducationFormItem;
