"use client";

import copy from "copy-to-clipboard";
import { Link2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { getResumeFileAction } from "@/app/actions/get-resume-file-action";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CopyResumeLinkButton = ({ resumeId }: { resumeId: string }) => {
	const [isPending, startTransition] = useTransition();

	function copyLink() {
		startTransition(async () => {
			const result = await getResumeFileAction(resumeId);
			if (!result.success) {
				toast.error(result.message || "Failed to get file link");
				return;
			}
			copy(result.data.shortenedUrl);
			toast.success("Link copied to clipboard");
		});
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800" onClick={copyLink} disabled={isPending}>
						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>Copy link</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CopyResumeLinkButton;
