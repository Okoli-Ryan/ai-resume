"use client";

import { Upload } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import TagsInputForm from "@/components/tags-input-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImportResumeRequest } from "@/services/resume/import-resume";

type Props = {
	form: UseFormReturn<Partial<ImportResumeRequest>>;
	file: File | null;
	setFile: (file: File | null) => void;
};

const ImportModeContent = ({ form, file, setFile }: Props) => {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || !files.length) return;
		setFile(files[0]);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const files = e.dataTransfer.files;
		if (files && files.length > 0 && files[0].type === "application/pdf") {
			setFile(files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<div className="space-y-4 py-4">
			{/* File Drop Area */}
			<div
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
				<input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
				<label htmlFor="file-upload" className="cursor-pointer">
					<Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
					<p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Drop your PDF here or click to browse"}</p>
					<p className="text-xs text-muted-foreground">PDF files only</p>
				</label>
			</div>

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

			{/* Tags */}
			<TagsInputForm<ImportResumeRequest>
				form={form}
				name="additionalInfo.tags"
				label="Tags (optional)"
				placeholder="Add tags (press Enter)"
			/>
		</div>
	);
};

export default ImportModeContent;
