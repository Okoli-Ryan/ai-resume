"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Routes } from "@/lib/routes";

const CopyResumeLinkButton = ({ resumeId }: { resumeId: string }) => {
	function copyLink() {
		const url = `${window.location.origin}${Routes.editResume(resumeId)}`;
		navigator.clipboard.writeText(url);
		toast.success("Link copied to clipboard");
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800" onClick={copyLink}>
						<Link2 className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Copy link</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CopyResumeLinkButton;
