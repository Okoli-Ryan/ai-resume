"use client";

import { Copy, LoaderCircle } from "lucide-react";
import { useRouter } from 'nextjs-toploader/app';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Routes } from '@/lib/routes';

import { duplicateResumeAction } from '../actions/duplicate-resume-action';

const DuplicateResumeButton = ({ resumeId }: { resumeId: string }) => {
	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	function duplicate() {
		startTransition(async () => {
			const response = await duplicateResumeAction(resumeId);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			router.push(Routes.editResume(response.data.id!));
		});
	}

	return (
		<Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={duplicate}>
			{isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
			<span className="sr-only">Duplicate resume</span>
		</Button>
	);
};

export default DuplicateResumeButton;
