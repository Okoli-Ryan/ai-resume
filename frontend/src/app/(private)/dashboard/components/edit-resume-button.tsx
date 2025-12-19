"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Routes } from "@/lib/routes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditResumeButtonProps {
	resumeId: string;
}

export default function EditResumeButton({ resumeId }: EditResumeButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link href={Routes.editResume(resumeId)}>
						<Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary/80">
							<Edit className="w-4 h-4" />
						</Button>
					</Link>
				</TooltipTrigger>
				<TooltipContent>
					<p>Edit</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
