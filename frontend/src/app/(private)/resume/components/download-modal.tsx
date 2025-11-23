"use client";

import { useState } from "react";
import { usePDF } from "react-to-pdf";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useResumeStore } from "@/store/resume-store";
import { Download } from "lucide-react";

const DownloadModal = ({ targetRef }: { targetRef: React.RefObject<HTMLDivElement> }) => {
	const [open, setOpen] = useState(false);
	const resume = useResumeStore((state) => state.resume);
	
	const filename = (resume?.resumeName || Date.now()).toString() + ".pdf";

	const { toPDF } = usePDF({
		targetRef,
		filename,
		page: { 
			format: 'A4',
			margin: 0,
		}
	});

	const handleDownload = () => {
		toPDF();
		setOpen(false);
	};

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
				<Button type="button" onClick={handleDownload}>
					Download as PDF
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default DownloadModal;
