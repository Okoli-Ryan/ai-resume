"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from 'nextjs-toploader/app';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { createResumeAction } from '@/app/(private)/(root)/actions/create-resume-action';
import { Button } from '@/components/ui/button';
import { Routes } from '@/lib/routes';
import { useResumeStore } from '@/store/resume-store';

const CreateResumeButton = () => {
	const clearResume = useResumeStore((state) => state.clear);
	const clearResumeDraft = useResumeStore((state) => state.clearDraft);

	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	function createNew() {
		startTransition(async () => {
			const response = await createResumeAction({});

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			clearResume();
			clearResumeDraft();
			router.push(Routes.editResume(response.data.id));
		});
	}

	return (
		<div className="relative group">
			<div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
				<Button onClick={createNew} className="bg-white rounded-full mr-2 hover:bg-gray-400 transition-colors duration-300">
					{isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Plus className="h-6 w-6 text-gray-800" />}
				</Button>
			</div>
		</div>
	);
};

export default CreateResumeButton;
