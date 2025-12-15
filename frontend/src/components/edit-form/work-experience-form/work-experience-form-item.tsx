"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TResume } from "@/types/resume";
import { Building2, Link2, User, MapPin, Calendar, Trash2 } from "lucide-react";

import FormLayout from "@/app/layouts/form-layout";
import { BulletPointsForm } from "../bullet-point-form/bullet-point-form";
import DateFormItem from "../common/date-form-item";

type WorkExperienceFormItemProps = {
	form: UseFormReturn<TResume, any, TResume>;
	index: number;
	remove: UseFieldArrayRemove;
};

const WorkExperienceFormItem = ({ form, index, remove }: WorkExperienceFormItemProps) => {
	const { control, watch } = form;
	const isOngoing = watch(`workExperience.${index}.isOngoing`);

	return (
		<FormLayout>
			<div className="space-y-5">
				{/* Company Information */}
				<div className="space-y-4">
					<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<Building2 className="h-4 w-4" />
						Company Information
					</h4>
					
					<FormField
						control={control}
						name={`workExperience.${index}.companyName`}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Company Name</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										placeholder="e.g., Google, Microsoft, Startup Inc."
										className="transition-all focus:ring-2 focus:ring-primary/20"
									/>
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
								<FormLabel className="text-sm font-medium flex items-center gap-2">
									<Link2 className="h-3.5 w-3.5 text-muted-foreground" />
									Company Website (Optional)
								</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										placeholder="https://company.com"
										className="transition-all focus:ring-2 focus:ring-primary/20"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Position Details */}
				<div className="space-y-4 pt-4 border-t border-border">
					<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<User className="h-4 w-4" />
						Position Details
					</h4>

					<FormField
						control={control}
						name={`workExperience.${index}.title`}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Job Title</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										placeholder="e.g., Senior Software Engineer"
										className="transition-all focus:ring-2 focus:ring-primary/20"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={control}
							name={`workExperience.${index}.workType`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Work Type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
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

						<FormField
							control={control}
							name={`workExperience.${index}.location`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium flex items-center gap-2">
										<MapPin className="h-3.5 w-3.5 text-muted-foreground" />
										Location
									</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											placeholder="City, State/Country or Remote"
											className="transition-all focus:ring-2 focus:ring-primary/20"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Duration */}
				<div className="space-y-4 pt-4 border-t border-border">
					<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						Duration
					</h4>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DateFormItem name={`workExperience.${index}.startDate`} control={control} label="Start Date" />
						<DateFormItem disabled={isOngoing} name={`workExperience.${index}.endDate`} control={control} label="End Date" />
					</div>

					<FormField
						control={control}
						name={`workExperience.${index}.isOngoing`}
						render={({ field }) => (
							<FormItem className="flex items-center gap-3 space-y-0 p-3 bg-muted/30 rounded-md">
								<FormControl>
									<Checkbox 
										id={`workExperience-${index}-isOngoing`}
										checked={field.value} 
										onCheckedChange={field.onChange} 
									/>
								</FormControl>
								<FormLabel 
									htmlFor={`workExperience-${index}-isOngoing`}
									className="font-normal cursor-pointer"
								>
									I currently work here
								</FormLabel>
							</FormItem>
						)}
					/>
				</div>

				{/* Responsibilities */}
				<div className="pt-4 border-t border-border">
					<BulletPointsForm enhanceType="Experience" form={form} name={`workExperience.${index}.bulletPoints`} />
				</div>

				{/* Remove Button */}
				<Button 
					variant="destructive" 
					onClick={() => remove(index)}
					className="w-full flex items-center justify-center gap-2 mt-4"
				>
					<Trash2 className="h-4 w-4" />
					Remove This Experience
				</Button>
			</div>
		</FormLayout>
	);
};

export default WorkExperienceFormItem;
