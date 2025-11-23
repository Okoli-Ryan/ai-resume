"use client";

import { Upload } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { ChangeEvent, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Routes } from "@/lib/routes";
import { fileToBase64 } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";
import { importResumeAction } from "../actions/import-resume-action";

const ImportResumeButton = () => {
	const clearResume = useResumeStore((state) => state.clear);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || !files.length) return;

		const file = files[0];

		const fileBase64 = await fileToBase64(file);

		startTransition(async () => {
			const response = await importResumeAction(fileBase64);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			clearResume();
			router.push(Routes.editResume(response.data.id));
		});
	};

	return (
		<label className="cursor-pointer relative">
			<Button loading={isPending} variant="outline" className="flex-1 sm:flex-initial font-medium py-3 px-6 shadow-sm">
				<Upload className="w-4 h-4 mr-2" />
				Import Resume
			</Button>
			<Input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
		</label>
	);
};

export default ImportResumeButton;
