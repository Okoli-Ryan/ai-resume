"use client";

import { useState, useTransition } from "react";
import { Trash2, LoaderCircle } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { deleteResumeAction } from "../actions/delete-resume-action";

const DeleteResumeButton = ({ resumeId }: { resumeId: string }) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	function handleDelete() {
		startTransition(async () => {
			const response = await deleteResumeAction(resumeId);

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			toast.success("Resume deleted");
			setOpen(false);
			router.refresh();
		});
	}

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="text-red-600 hover:text-red-700 hover:bg-red-50"
							onClick={() => setOpen(true)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Delete</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Resume</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this resume? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={isPending}>
							{isPending ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : null}
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DeleteResumeButton;
