"use client";

import { UseFormReturn } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GenerateResumeFromPromptRequest } from "@/services/resume/generate-resume-from-prompt";

type Props = {
	form: UseFormReturn<GenerateResumeFromPromptRequest>;
};

const PromptModeContent = ({ form }: Props) => {
	return (
		<div className="space-y-4">
			{/* Prompt */}
			<FormField
				control={form.control}
				name="prompt"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Tell us about yourself</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Describe your experience, skills, and career goals... (e.g., I'm a software engineer with 5 years of experience in React and Node.js, passionate about building scalable web applications...)"
								className="min-h-[120px] resize-none"
								{...field}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Job Description */}
			<FormField
				control={form.control}
				name="additionalInfo.jobDescription"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Job Description (optional)</FormLabel>
						<FormControl>
							<Textarea placeholder="Paste the job description here..." className="min-h-[100px] resize-none" {...field} />
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Role */}
			<FormField
				control={form.control}
				name="additionalInfo.role"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Role (optional)</FormLabel>
						<FormControl>
							<Input placeholder="e.g., Software Engineer, Product Manager" {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
};

export default PromptModeContent;
