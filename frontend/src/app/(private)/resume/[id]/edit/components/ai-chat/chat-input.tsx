"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Lightbulb, SendHorizontal } from "lucide-react";
import { KeyboardEvent, memo, useRef, useState, useEffect } from "react";
import SuggestivePrompts from "./suggestive-prompts";

interface ChatInputProps {
	isLoading: boolean;
	onSubmit: (content: string) => void;
	resumeId?: string;
}

const ChatInput = ({ isLoading, onSubmit, resumeId }: ChatInputProps) => {
	const [input, setInput] = useState("");
	const [showPrompts, setShowPrompts] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const storageKey = `chat-input-${resumeId}`;

	// Close popup when clicking outside
	useEffect(() => {
		if (!showPrompts) return;
		const handler = (e: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				setShowPrompts(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [showPrompts]);

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

	const handlePromptSelect = (prompt: string) => {
		setShowPrompts(false);
		onSubmit(prompt);
	};

	return (
		<div className="border-t bg-background p-4">
			<div ref={popupRef} className="relative">
				{/* Prompts popup */}
				{showPrompts && (
					<div className="absolute bottom-full left-0 right-0 mb-2 z-10 rounded-xl border bg-background shadow-lg p-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-150">
						<p className="text-xs font-medium text-muted-foreground mb-2.5 px-0.5">Quick actions</p>
						<SuggestivePrompts variant="grid" onSelect={handlePromptSelect} />
					</div>
				)}

				<div className="relative flex items-end gap-2">
					{/* Quick actions trigger */}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => setShowPrompts((v) => !v)}
						className={cn("absolute top-1 animate-pulse left-2 h-8 w-8 shrink-0", showPrompts && "text-primary bg-primary/10")}
						disabled={isLoading}
						aria-label="Quick actions">
						<Lightbulb className="h-4 w-4 text-primary" />
					</Button>

					<Textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Ask about your resume..."
						className={cn("min-h-[60px] max-h-[200px] resize-none pl-12 pr-12", "focus-visible:ring-1 focus-visible:ring-primary")}
						disabled={isLoading}
						rows={1}
					/>
					<Button onClick={handleSubmit} disabled={!input.trim() || isLoading} size="icon" className="absolute bottom-2 right-2 h-8 w-8">
						<SendHorizontal className="h-4 w-4" />
						<span className="sr-only">Send message</span>
					</Button>
				</div>
			</div>
			<p className="mt-2 text-xs text-muted-foreground text-center">AI can make mistakes. Consider checking important information.</p>
		</div>
	);
};;;;;;;;;

export default memo(ChatInput);
