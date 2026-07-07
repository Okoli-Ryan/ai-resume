"use client";

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BookmarkCheck, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateResumeStatusAction } from '@/app/(private)/dashboard/actions/update-resume-status-action';
import { TResume } from '@/types/resume';

interface SaveDraftButtonProps {
	resumeId: string;
	currentStatus?: string;
}

export default function SaveDraftButton({ resumeId, currentStatus }: SaveDraftButtonProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const isDraft = currentStatus === 'Draft';
	const nextStatus = isDraft ? 'Published' : 'Draft';

	function handleToggle() {
		startTransition(async () => {
			const response = await updateResumeStatusAction(resumeId, nextStatus);
			if (!response.success) {
				toast.error(response.message);
				return;
			}
			toast.success(nextStatus === 'Draft' ? 'Saved as draft' : 'Resume published');
			router.refresh();
		});
	}

	return (
		<Button
			onClick={handleToggle}
			variant={isDraft ? 'default' : 'outline'}
			size="sm"
			disabled={isPending}
			className="gap-2"
		>
			{isPending ? (
				<LoaderCircle className="h-4 w-4 animate-spin" />
			) : (
				<BookmarkCheck className="h-4 w-4" />
			)}
			{isDraft ? 'Publish' : 'Save as Draft'}
		</Button>
	);
}
