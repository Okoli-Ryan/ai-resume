"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TResume } from "@/types/resume";

import FormLayout from "@/app/layouts/form-layout";
import { BulletPointsForm } from "../bullet-point-form/bullet-point-form";

type ProjectsFormItemProps = {
	form: UseFormReturn<TResume, any, TResume>;
	index: number;
	remove: UseFieldArrayRemove;
};

const ProjectsFormItem = ({ form, index, remove }: ProjectsFormItemProps) => {
	const { control } = form;

	return (
		<FormLayout>
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
			<BulletPointsForm enhanceType="Project" form={form} name={`projects.${index}.bulletPoints`} />
			<Button variant="destructive" onClick={() => remove(index)}>
				Remove Project
			</Button>
		</FormLayout>
	);
};

export default ProjectsFormItem;
