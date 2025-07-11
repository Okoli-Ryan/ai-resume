"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TResume } from "@/types/resume";

import { Card, CardContent } from "@/components/ui/card";
import { BulletPointsForm } from "../bullet-point-form/bullet-point-form";

type ProjectsFormItemProps = {
	form: UseFormReturn<TResume, any, undefined>;
	index: number;
	remove: UseFieldArrayRemove;
};

const ProjectsFormItem = ({ form, index, remove }: ProjectsFormItemProps) => {
	const { control } = form;

	return (
		<Card>
			<CardContent className="py-4 flex flex-col gap-4">
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
			</CardContent>
		</Card>
	);
};

export default ProjectsFormItem;
