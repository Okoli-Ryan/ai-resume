"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TResume } from "@/types/resume";
import { Award, Link2, Calendar, Trash2 } from "lucide-react";

import { BulletPointsForm } from "../bullet-point-form/bullet-point-form";
import DateFormItem from "../common/date-form-item";

type CertificationFormItemProps = {
	form: UseFormReturn<TResume, any, TResume>;
	index: number;
	remove: UseFieldArrayRemove;
};

const CertificationFormItem = ({ index, remove, form }: CertificationFormItemProps) => {
	const { control } = form;

	return (
		<div className="space-y-5 p-5 border border-border/50 rounded-lg bg-card shadow-sm">
			{/* Certification Information */}
			<div className="space-y-4">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
					<Award className="h-4 w-4" />
					Certification Information
				</h4>
				
				<FormField
					control={control}
					name={`certifications.${index}.certificationName`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium">Certification Name *</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									placeholder="e.g., AWS Certified Solutions Architect, PMP"
									className="transition-all focus:ring-2 focus:ring-primary/20"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`certifications.${index}.certificateLink`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium flex items-center gap-2">
								<Link2 className="h-3.5 w-3.5 text-muted-foreground" />
								Certificate Link (Optional)
							</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									placeholder="https://www.example.com/certificate"
									className="transition-all focus:ring-2 focus:ring-primary/20"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Date Information */}
			<div className="space-y-4 pt-4 border-t border-border">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
					<Calendar className="h-4 w-4" />
					Date Attained
				</h4>

				<DateFormItem 
					name={`certifications.${index}.dateAttained`} 
					control={control} 
					label="Date Attained" 
				/>
			</div>

			{/* Achievements/Details */}
			<div className="pt-4 border-t border-border">
				<BulletPointsForm form={form} name={`certifications.${index}.bulletPoints`} />
			</div>

			{/* Remove Button */}
			<Button 
				variant="destructive" 
				onClick={() => remove(index)}
				className="w-full flex items-center justify-center gap-2 mt-4"
			>
				<Trash2 className="h-4 w-4" />
				Remove This Certification
			</Button>
		</div>
	);
};

export default CertificationFormItem;
