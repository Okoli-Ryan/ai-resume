"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import { KeyboardEvent, memo, useRef, useState, useEffect } from "react";

interface ChatInputProps {
	isLoading: boolean;
	onSubmit: (content: string) => void;
	resumeId?: string; // Add resumeId for unique storage key
}

const ChatInput = ({ isLoading, onSubmit, resumeId }: ChatInputProps) => {
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const storageKey = `chat-input-${resumeId}`;

	// Load saved input on mount
	useEffect(() => {
		if (resumeId && typeof window !== "undefined") {
			const saved = localStorage.getItem(storageKey);
			if (saved) {
				setInput(saved);
			}
		}
	}, [resumeId, storageKey]);

	// Save input to localStorage on change
	useEffect(() => {
		if (resumeId && typeof window !== "undefined") {
			if (input) {
				localStorage.setItem(storageKey, input);
			} else {
				localStorage.removeItem(storageKey);
			}
		}
	}, [input, resumeId, storageKey]);

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (input.trim() && !isLoading) {
				onSubmit(input);
				setInput("");
			}
		}
	};

	const handleSubmit = () => {
		if (input.trim() && !isLoading) {
			onSubmit(input);
			setInput("");
		}
	};

	return (
		<div className="border-t bg-background p-4">
			<div className="relative flex items-end gap-2">
				<Textarea
					ref={textareaRef}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Ask about your resume..."
					className={cn(
						"min-h-[60px] max-h-[200px] resize-none pr-12",
						"focus-visible:ring-1 focus-visible:ring-primary"
					)}
					disabled={isLoading}
					rows={1}
				/>
				<Button
					onClick={handleSubmit}
					disabled={!input.trim() || isLoading}
					size="icon"
					className="absolute bottom-2 right-2 h-8 w-8">
					<SendHorizontal className="h-4 w-4" />
					<span className="sr-only">Send message</span>
				</Button>
			</div>
			<p className="mt-2 text-xs text-muted-foreground text-center">
				AI can make mistakes. Consider checking important information.
			</p>
		</div>
	);
};

export default memo(ChatInput);
