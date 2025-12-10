"use client";

import { Upload } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { ChangeEvent, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import TagsInputForm from "@/components/tags-input-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Routes } from "@/lib/routes";
import { fileToBase64 } from "@/lib/utils";
import { ImportResumeRequest } from "@/services/resume/import-resume";
import { useResumeStore } from "@/store/resume-store";
import { importResumeAction } from "../actions/import-resume-action";

const ImportResumeButton = () => {
	const clearResume = useResumeStore((state) => state.clear);
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const router = useRouter();

	const form = useForm<Partial<ImportResumeRequest>>({
		defaultValues: {
			base64String: "",
			additionalInfo: {
				jobDescription: "",
				role: "",
				tags: "",
			},
		},
	});

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

	const handleSubmit = async () => {
		if (!file) {
			toast.error("Please select a PDF file");
			return;
		}

		const fileBase64 = await fileToBase64(file);
		const values = form.getValues();

		const payload: ImportResumeRequest = {
			base64String: fileBase64,
			additionalInfo: {
				jobDescription: values.additionalInfo?.jobDescription || undefined,
				role: values.additionalInfo?.role || undefined,
				tags: values.additionalInfo?.tags || undefined,
			},
		};

		startTransition(async () => {
			const response = await importResumeAction(payload);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			clearResume();
			setOpen(false);
			setFile(null);
			form.reset();
			router.push(Routes.editResume(response.data.id));
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="flex-1 sm:flex-initial font-medium py-3 px-6 shadow-sm">
					<Upload className="w-4 h-4 mr-2" />
					Import Resume
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Import Resume</DialogTitle>
					<DialogDescription>Upload your resume PDF and provide additional information to enhance it.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
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
				</Form>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} loading={isPending}>
						Import Resume
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ImportResumeButton;
