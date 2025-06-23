"use client";

import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { TResume } from '@/types/resume';

import { BulletPointsForm } from "../common/bullet-point-form";
import DateFormItem from "../common/date-form-item";

type WorkExperienceFormItemProps = {
	form: UseFormReturn<TResume, any, undefined>;
	index: number;
	remove: UseFieldArrayRemove;
};

const WorkExperienceFormItem = ({ form, index, remove }: WorkExperienceFormItemProps) => {
	const { control, watch } = form;
	const isOngoing = watch(`workExperience.${index}.isOngoing`);

	return (
		<Card>
			<CardContent className="py-4 flex flex-col gap-4">
				<FormField
					control={control}
					name={`workExperience.${index}.companyName`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`workExperience.${index}.companyLink`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company Link</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`workExperience.${index}.title`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`workExperience.${index}.workType`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Work Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select Work Type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="full-time">Full-time</SelectItem>
									<SelectItem value="part-time">Part-time</SelectItem>
									<SelectItem value="contract">Contract</SelectItem>
									<SelectItem value="internship">Internship</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DateFormItem name={`workExperience.${index}.startDate`} control={control} label="Start Date" />

				<FormField
					control={control}
					name={`workExperience.${index}.isOngoing`}
					render={({ field }) => (
						<FormItem className="flex items-center gap-2 space-y-0">
							<FormLabel className="font-normal">Is Ongoing?</FormLabel>
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>

				<DateFormItem disabled={isOngoing} name={`workExperience.${index}.endDate`} control={control} label="End Date" />

				<FormField
					control={control}
					name={`workExperience.${index}.location`}
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

				{/* Bullet Points Section */}
				<div className="flex justify-between items-center">
					<FormLabel>Bullet Points</FormLabel>
				</div>

				<BulletPointsForm form={form} name={`workExperience.${index}.bulletPoints`} />

				<Button variant="destructive" onClick={() => remove(index)}>
					Remove Experience
				</Button>
			</CardContent>
		</Card>
	);
};

export default WorkExperienceFormItem;
