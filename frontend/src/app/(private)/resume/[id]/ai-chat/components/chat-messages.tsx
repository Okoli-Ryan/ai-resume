"use client";

import { memo, useEffect, useRef } from "react";
import ChatMessage from "./chat-message";
import { UIMessage } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
	messages: UIMessage[];
	isLoading: boolean;
}

// Helper function to extract text content from message parts
const getMessageContent = (message: UIMessage): string => {
	return message.parts
		.filter((part): part is { type: "text"; text: string } => part.type === "text")
		.map((part) => part.text)
		.join("");
};

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	if (messages.length === 0) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
				<div className="rounded-full bg-primary/10 p-4 mb-4">
					<svg
						className="h-8 w-8 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						/>
					</svg>
				</div>
				<h3 className="font-semibold text-lg mb-2">Resume AI Assistant</h3>
				<p className="text-muted-foreground text-sm max-w-sm">
					Ask me anything about your resume! I can help you improve content, suggest better phrasing, or provide
					tips for making your resume stand out.
				</p>
				<div className="mt-6 space-y-2">
					<p className="text-xs text-muted-foreground">Try asking:</p>
					<div className="flex flex-wrap gap-2 justify-center">
						{["How can I improve my summary?", "Suggest better action verbs", "Review my experience section"].map(
							(suggestion) => (
								<span
									key={suggestion}
									className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground">
									{suggestion}
								</span>
							)
						)}
					</div>
				</div>
			</div>
		);
	}

	// Filter out messages with empty content (happens during tool calls)
	const filteredMessages = messages.filter((message) => {
		const content = getMessageContent(message);
		return content.trim().length > 0;
	});

	return (
		<div ref={scrollRef} className="flex-1 overflow-y-auto">
			{filteredMessages.map((message) => (
				<ChatMessage 
					key={message.id} 
					role={message.role as "user" | "assistant"} 
					content={getMessageContent(message)} 
				/>
			))}
			{isLoading && messages[messages.length - 1]?.role === "user" && (
				<div className="flex gap-3 p-4">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
						<Loader2 className="h-4 w-4 animate-spin" />
					</div>
					<div className="flex-1 rounded-lg bg-muted px-4 py-3">
						<div className="flex items-center gap-1">
							<span className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse" />
							<span className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse delay-150" />
							<span className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse delay-300" />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(ChatMessages);
