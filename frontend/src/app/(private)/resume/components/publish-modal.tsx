import { useRouter } from 'nextjs-toploader/app';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Routes } from '@/lib/routes';
import { useResumeStore } from '@/store/resume-store';

import { createResumeAction } from '../../(root)/actions/create-resume-action';

const PublishModal = () => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const clearResumeDraft = useResumeStore((state) => state.clearDraft);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;

		if (!name?.trim()) return;

		const currentResumeState = useResumeStore.getState().resume;

		if (!currentResumeState) {
			toast.error("Please create your resume first");
			return;
		}

		startTransition(async () => {
			currentResumeState.resumeName = name;

			const response = await createResumeAction(currentResumeState);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			setOpen(false);
			toast.success("Resume published successfully");
			clearResumeDraft();
			router.replace(Routes.editResume(response.data.id));
		});
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* <DialogTrigger asChild>
				<Button
					type="button"
					className="fixed bottom-24 right-8 z-10 flex items-center justify-center rounded-full bg-primary px-8 py-6 text-white shadow-lg">
					Publish
					<UploadCloud className="h-5 w-5 ml-2" />
				</Button>
			</DialogTrigger> */}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Publish Resume</DialogTitle>
					<DialogDescription>Enter a name for your resume to publish it.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" placeholder="Enter name" required disabled={isPending} />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Publishing..." : "Publish"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default PublishModal;
