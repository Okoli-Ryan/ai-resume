"use client";

import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TResume } from '@/types/resume';

import { BulletPointsForm } from "../common/bullet-point-form";

type ProjectsFormItemProps = {
	form: UseFormReturn<TResume, any, undefined>;
	index: number;
	remove: UseFieldArrayRemove;
};

const ProjectsFormItem = ({ form, index, remove }: ProjectsFormItemProps) => {
	const { control } = form;

	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name={`projects.${index}.name`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Project Name</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* <FormField
				control={control}
				name={`projects.${index}.description`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/> */}

			<FormField
				control={control}
				name={`projects.${index}.link`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Link</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div>
				<div className="flex justify-between items-center mb-2">
					<FormLabel>Bullet Points</FormLabel>
				</div>

				<BulletPointsForm form={form} name={`projects.${index}.bulletPoints`} />
			</div>

			<Button variant="destructive" onClick={() => remove(index)}>
				Remove Project
			</Button>
		</div>
	);
};

export default ProjectsFormItem;
