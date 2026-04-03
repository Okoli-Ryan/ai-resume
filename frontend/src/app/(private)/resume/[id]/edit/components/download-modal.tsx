"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Download, ExternalLink, Link2, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useResumeStore } from "@/store/resume-store";
import { downloadPDF } from "@/lib/utils";
import { toast } from "sonner";
import { uploadResumeFileAction } from "@/app/actions/upload-resume-file-action";

const DownloadModal = () => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [isUploading, startUpload] = useTransition();
	const [fileUrl, setFileUrl] = useState<string | null>(null);

	const resume = useResumeStore((state) => state.resume);
	const filename = (resume?.resumeName || Date.now()).toString() + ".pdf";

	const params = useParams();
	const resumeId = params.id as string;

	function downloadResume() {
		startTransition(async () => {
			if (!resumeId) {
				console.error("No resume ID available");
				return;
			}

			try {
				await downloadPDF(resumeId, filename);
			} catch (error) {
				toast.error("Failed to download PDF. Please try again.");
				console.error("Error downloading PDF:", error);
			}
		});
	}

	function handleUpload() {
		startUpload(async () => {
			const result = await uploadResumeFileAction(resumeId, filename);
			if (!result.success) {
				toast.error(result.message || "Failed to upload file");
				return;
			}
			setFileUrl(result.data.url);
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
				<div className="space-y-3">
					{fileUrl && (
						<div className="flex items-center gap-1">
							<Input value={fileUrl} readOnly className="flex-1 text-xs" />
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => navigator.clipboard.writeText(fileUrl)}>
								<Copy className="h-4 w-4" />
							</Button>
							<Button type="button" variant="ghost" size="icon" asChild>
								<a href={fileUrl} target="_blank" rel="noopener noreferrer">
									<ExternalLink className="h-4 w-4" />
								</a>
							</Button>
						</div>
					)}
					<Button type="button" onClick={downloadResume} disabled={isPending} className="w-full">
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Download as PDF
					</Button>
					<Button type="button" variant="outline" onClick={handleUpload} disabled={isUploading} className="w-full">
						{isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
						Get Link
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DownloadModal;
