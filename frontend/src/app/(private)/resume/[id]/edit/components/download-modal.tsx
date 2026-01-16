"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Loader2 } from "lucide-react";

const DownloadModal = ({ toPDF }: { toPDF: () => Promise<void> }) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	function downloadResume() {
		startTransition(async () => {
			await toPDF();
			setOpen(false);
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					type="button"
					className="fixed bottom-24 right-8 z-10 flex items-center justify-center rounded-full bg-primary size-12 text-white shadow-lg">
					<Download className="h-5 w-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Get Resume</DialogTitle>
					<DialogDescription>Download as PDF</DialogDescription>
				</DialogHeader>
				<Button type="button" onClick={downloadResume} disabled={isPending}>
					{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Download as PDF
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default DownloadModal;
