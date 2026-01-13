"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { memo } from "react";

interface ChatMessageProps {
	role: "user" | "assistant";
	content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
	const isUser = role === "user";

	return (
		<div className={cn("flex gap-3 p-4", isUser ? "flex-row-reverse" : "flex-row")}>
			<div
				className={cn(
					"flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
					isUser ? "bg-primary text-primary-foreground" : "bg-muted"
				)}>
				{isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
			</div>
			<div
				className={cn(
					"flex-1 space-y-2 overflow-hidden rounded-lg px-4 py-3 text-sm",
					isUser ? "bg-primary text-primary-foreground" : "bg-muted"
				)}>
				<div className="whitespace-pre-wrap break-words leading-relaxed">{content}</div>
			</div>
		</div>
	);
};

export default memo(ChatMessage);
