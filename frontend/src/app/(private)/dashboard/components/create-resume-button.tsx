"use client";

import { Plus } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import PromptModeContent from "./prompt-mode-content";
import ImportModeContent from "./import-mode-content";
import ScratchModeContent from "./scratch-mode-content";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Routes } from "@/lib/routes";
import { fileToBase64, validateResumeFile } from "@/lib/utils";
import { GenerateResumeFromPromptRequest } from "@/services/resume/generate-resume-from-prompt";
import { ImportResumeRequest } from "@/services/resume/import-resume";
import { useResumeStore } from "@/store/resume-store";
import { createResumeAction } from "../actions/create-resume-action";
import { generateResumeFromPromptAction } from "../actions/generate-resume-from-prompt-action";
import { importResumeAction } from "../actions/import-resume-action";

type CreateMode = "prompt" | "scratch" | "import";

const modes: Array<{ value: CreateMode; label: string }> = [
	{ value: "scratch", label: "Create from scratch" },
	{ value: "prompt", label: "Generate from prompt" },
	{ value: "import", label: "Import as PDF" },
];

const CreateResumeButton = () => {
	const clearResume = useResumeStore((state) => state.clear);
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<CreateMode>("scratch");
	const [file, setFile] = useState<File | null>(null);
	const router = useRouter();

	// Validate on drop/select before storing
	const handleFileSelect = (value: File | null | ((prev: File | null) => File | null)) => {
		const selected = typeof value === "function" ? value(file) : value;
		if (!selected) {
			setFile(null);
			return;
		}
		const validation = validateResumeFile(selected);
		if (!validation.valid) {
			toast.error(validation.message ?? "Invalid file");
			return;
		}
		setFile(selected);
	};

	const formPrompt = useForm<GenerateResumeFromPromptRequest>({
		defaultValues: {
			prompt: "",
			additionalInfo: {
				jobDescription: "",
				role: "",
				tags: "",
			},
		},
	});

	const formImport = useForm<Partial<ImportResumeRequest>>({
		defaultValues: {
			base64String: "",
			additionalInfo: {
				jobDescription: "",
				role: "",
				tags: "",
			},
		},
	});

	const handleSubmit = () => {
		if (mode === "scratch") {
			startTransition(async () => {
				const response = await createResumeAction({});

				if (!response.success) {
					toast.error(response.message);
					return;
				}

				clearResume();
				setOpen(false);
				formPrompt.reset();
				formImport.reset();
				setFile(null);
				router.push(Routes.editResume(response.data.id));
			});
			return;
		}

		if (mode === "prompt") {
			const payload = formPrompt.getValues();
			startTransition(async () => {
				const response = await generateResumeFromPromptAction(payload);

				if (!response.success) {
					toast.error(response.message);
					return;
				}

				clearResume();
				setOpen(false);
				formPrompt.reset();
				formImport.reset();
				setFile(null);
				router.push(Routes.editResume(response.data.id));
			});
			return;
		}

		// import mode
		if (!file) {
			toast.error("Please select a PDF file");
			return;
		}

		// Validate size/type again on submit
		const validation = validateResumeFile(file);
		if (!validation.valid) {
			toast.error(validation.message ?? "Invalid file");
			return;
		}

		startTransition(async () => {
			const fileBase64 = await fileToBase64(file);
			const values = formImport.getValues();

			const payload: ImportResumeRequest = {
				base64String: fileBase64,
				additionalInfo: {
					jobDescription: values.additionalInfo?.jobDescription || undefined,
					role: values.additionalInfo?.role || undefined,
					tags: values.additionalInfo?.tags || undefined,
				},
			};

			const response = await importResumeAction(payload);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			clearResume();
			setOpen(false);
			formPrompt.reset();
			formImport.reset();
			setFile(null);
			router.push(Routes.editResume(response.data.id));
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 shadow-sm">
					<Plus className="w-4 h-4 mr-2" />
					Create Resume
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Create Resume</DialogTitle>
					<DialogDescription>Choose how you want to create your resume.</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					{/* Radio Group */}
					<div className="space-y-3">
						<Label>Creation Mode</Label>
						<div className="flex flex-col space-y-2">
							{modes.map((m) => (
								<label key={m.value} className="flex items-center space-x-3 cursor-pointer">
									<input
										type="radio"
										name="mode"
										value={m.value}
										checked={mode === m.value}
										onChange={() => setMode(m.value)}
										className="w-4 h-4 text-primary"
									/>
									<span className="text-sm">{m.label}</span>
								</label>
							))}
						</div>
					</div>

					{/* Mode-specific content */}
					{mode === "prompt" && (
						<Form {...formPrompt}>
							<PromptModeContent form={formPrompt} />
						</Form>
					)}

					{mode === "scratch" && <ScratchModeContent />}

					{mode === "import" && (
						<Form {...formImport}>
							<ImportModeContent form={formImport} file={file} setFile={handleFileSelect} />
						</Form>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} loading={isPending}>
						{mode === "scratch" ? "Create Resume" : mode === "prompt" ? "Generate Resume" : "Import Resume"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateResumeButton;
