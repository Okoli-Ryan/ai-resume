"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TResume } from "@/types/resume";
import { FolderGit2, Link2, Trash2 } from "lucide-react";

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
			<div className="space-y-5">
				{/* Project Information */}
				<div className="space-y-4">
					<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<FolderGit2 className="h-4 w-4" />
						Project Information
					</h4>
					
					<FormField
						control={control}
						name={`projects.${index}.name`}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Project Name</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										placeholder="e.g., E-commerce Platform, Mobile App"
										className="transition-all focus:ring-2 focus:ring-primary/20"
									/>
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
								<FormLabel className="text-sm font-medium flex items-center gap-2">
									<Link2 className="h-3.5 w-3.5 text-muted-foreground" />
									Project Link (Optional)
								</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										placeholder="https://github.com/username/project or demo link"
										className="transition-all focus:ring-2 focus:ring-primary/20"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Project Details */}
				<div className="pt-4 border-t border-border">
					<BulletPointsForm enhanceType="Project" form={form} name={`projects.${index}.bulletPoints`} />
				</div>

				{/* Remove Button */}
				<Button 
					variant="destructive" 
					onClick={() => remove(index)}
					className="w-full flex items-center justify-center gap-2 mt-4"
				>
					<Trash2 className="h-4 w-4" />
					Remove This Project
				</Button>
			</div>
		</FormLayout>
	);
};

export default ProjectsFormItem;
