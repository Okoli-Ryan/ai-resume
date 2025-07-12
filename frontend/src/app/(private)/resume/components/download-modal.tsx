import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useResumeStore } from "@/store/resume-store";
import { Download } from "lucide-react";

const DownloadModal = ({ url }: { url: string }) => {
	const [open, setOpen] = useState(false);
	const resume = useResumeStore((state) => state.resume);

	const filename = (resume?.resumeName || Date.now()).toString() + ".pdf";

	// const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	const formData = new FormData(e.currentTarget);
	// 	const name = formData.get("name") as string;

	// 	if (!name?.trim()) return;

	// 	const currentResumeState = useResumeStore.getState().resume;

	// 	if (!currentResumeState) {
	// 		toast.error("Please create your resume first");
	// 		return;
	// 	}

	// 	startTransition(async () => {
	// 		currentResumeState.resumeName = name;

	// 		const response = await createResumeAction(currentResumeState);

	// 		if (!response.success) {
	// 			toast.error(response.message);
	// 			return;
	// 		}

	// 		setOpen(false);
	// 		toast.success("Resume published successfully");
	// 		clearResumeDraft();
	// 		router.replace(Routes.editResume(response.data.id));
	// 	});
	// };
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
					<DialogDescription>Download as PDF or Get a link</DialogDescription>
				</DialogHeader>
				<a href={url} download={filename}>
					<Button type="button">Download as PDF</Button>
				</a>
			</DialogContent>
		</Dialog>
	);
};

export default DownloadModal;
