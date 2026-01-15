"use client";

import { memo, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatContainer from "./chat-container";

interface ChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	resumeId: string;
}

const ChatModal = ({ isOpen, onClose, resumeId }: ChatModalProps) => {
	// Handle ESC key to close
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const handleOverlayClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === e.currentTarget) {
				onClose();
			}
		},
		[onClose]
	);

	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex items-center justify-center transition-all duration-200",
				isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
			)}
			onClick={handleOverlayClick}
			aria-hidden={!isOpen}>
			{/* Overlay */}
			<div
				className={cn(
					"absolute inset-0 bg-black/50 transition-opacity duration-200",
					isOpen ? "opacity-100" : "opacity-0"
				)}
			/>

			{/* Modal Content */}
			<div
				className={cn(
					"relative bg-background rounded-lg shadow-xl w-full max-w-[600px] h-[80vh] max-h-[700px] flex flex-col overflow-hidden transition-all duration-200",
					isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
				)}>
				{/* Header */}
				<div className="px-6 py-4 border-b flex items-center justify-between bg-background">
					<div>
						<h2 className="text-lg font-semibold flex items-center gap-2">
							<svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							Resume AI Assistant
						</h2>
						<p className="text-sm text-muted-foreground mt-1">Get AI-powered suggestions and improvements for your resume.</p>
					</div>
					{/* Custom close button */}
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-muted transition-colors"
						aria-label="Close modal">
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Chat Content - Always mounted to preserve state */}
				<div className="flex-1 overflow-hidden bg-background">
					<ChatContainer resumeId={resumeId} />
				</div>
			</div>
		</div>
	);
};
export default memo(ChatModal);
