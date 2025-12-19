"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { downloadPDF } from "@/lib/utils";
import { Download, LoaderCircle } from "lucide-react";
import { useTransition } from "react";

interface DownloadResumeButtonProps {
	resumeId: string;
	resumeName?: string | null;
	role?: string | null;
}

const DownloadResumeButton = ({ resumeId, resumeName, role }: DownloadResumeButtonProps) => {
	const name = (resumeName && resumeName.trim()) || (role && `${role} resume`) || "My Resume";

	const [isPending, startTransition] = useTransition();

	function downloadResume() {
		startTransition(async () => {
			downloadPDF(resumeId, name);
		});
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800" onClick={downloadResume}>
						{isPending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>Download</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default DownloadResumeButton;
