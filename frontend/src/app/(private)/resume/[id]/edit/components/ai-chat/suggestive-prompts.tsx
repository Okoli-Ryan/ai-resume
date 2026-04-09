"use client";

import { cn } from "@/lib/utils";
import {
	Briefcase,
	FileText,
	FolderGit2,
	GraduationCap,
	Link2,
	Sparkles,
	Target,
	Wrench,
} from "lucide-react";
import { memo } from "react";

interface Prompt {
	label: string;
	prompt: string;
	icon: React.ElementType;
}

const PROMPTS: Prompt[] = [
	{
		label: "Get uploaded resume URL",
		prompt: "Give me the URL of my uploaded resume PDF",
		icon: Link2,
	},
	{
		label: "Enhance work bullets",
		prompt: "Enhance my work experience bullet points with strong action verbs and quantifiable achievements",
		icon: Briefcase,
	},
	{
		label: "Improve education entries",
		prompt: "Review and improve my education bullet points",
		icon: GraduationCap,
	},
	{
		label: "Improve project descriptions",
		prompt: "Improve my project descriptions to better highlight technical impact",
		icon: FolderGit2,
	},
	{
		label: "Suggest relevant skills",
		prompt: "Review my skills section and suggest additional relevant skills for my role",
		icon: Wrench,
	},
	{
		label: "Rewrite my summary",
		prompt: "Review and rewrite my resume summary to make it more compelling and concise",
		icon: FileText,
	},
	{
		label: "Tailor to job description",
		prompt: "Tailor my resume to better match the target job description",
		icon: Target,
	},
	{
		label: "Overall resume feedback",
		prompt: "What are the weakest parts of my resume and how can I improve them?",
		icon: Sparkles,
	},
];

interface SuggestivePromptsProps {
	onSelect: (prompt: string) => void;
	variant: "grid" | "compact";
	className?: string;
}

const SuggestivePrompts = ({ onSelect, variant, className }: SuggestivePromptsProps) => {
	if (variant === "compact") {
		return (
			<div className={cn("px-4 py-2 border-t", className)}>
				<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
					{PROMPTS.map((p) => {
						const Icon = p.icon;
						return (
							<button
								key={p.label}
								onClick={() => onSelect(p.prompt)}
								className="flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground shrink-0"
							>
								<Icon className="h-3 w-3" />
								{p.label}
							</button>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<div className={cn("grid grid-cols-2 gap-2 w-full", className)}>
			{PROMPTS.map((p) => {
				const Icon = p.icon;
				return (
					<button
						key={p.label}
						onClick={() => onSelect(p.prompt)}
						className="flex items-start gap-2.5 rounded-lg border bg-muted/40 p-3 text-left transition-colors hover:bg-muted hover:border-primary/30 group"
					>
						<span className="mt-0.5 rounded-md bg-primary/10 p-1.5 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
							<Icon className="h-3.5 w-3.5" />
						</span>
						<span className="text-xs font-medium self-center text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
							{p.label}
						</span>
					</button>
				);
			})}
		</div>
	);
};

export default memo(SuggestivePrompts);
