"use client";
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Routes } from '@/lib/routes';
import { useResumeStore } from '@/store/resume-store';

const RestoreModal = ({ defaultOpen }: { defaultOpen?: boolean }) => {
	const [open, setOpen] = useState(defaultOpen);
	const router = useRouter();
	const updateResume = useResumeStore((state) => state.update);
	const pathname = usePathname();

	console.log(pathname);

	function close() {
		setOpen(false);
	}

	function restore() {
		const currentResumeDraft = useResumeStore.getState().resumeDraft!;

		if (pathname === Routes.createResume && !currentResumeDraft?.id) {
			updateResume(currentResumeDraft);
			close();
			return;
		}

		if (pathname !== Routes.createResume && !currentResumeDraft?.id) {
			updateResume(currentResumeDraft);
			router.replace(Routes.createResume);
			close();
			return;
		}

		if (currentResumeDraft?.id) {
			updateResume(currentResumeDraft);
			router.replace(Routes.editResume(currentResumeDraft.id));
			close();
			return;
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Restore Previous Data</DialogTitle>
					<DialogDescription>Would you like to restore previous data?</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={close}>
						Cancel
					</Button>
					<Button onClick={restore}>Restore</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RestoreModal;
