"use client";

import { memo } from "react";
import Modal from "react-responsive-modal";
import ChatContainer from "./chat-container";
import "react-responsive-modal/styles.css";

interface ChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	resumeId: string;
}

const ChatModal = ({ isOpen, onClose, resumeId }: ChatModalProps) => {
	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			center
			closeOnOverlayClick={true}
			closeOnEsc={true}
			showCloseIcon={true}
			styles={{
				modal: {
					padding: 0,
					borderRadius: "8px",
					width: "100%",
					maxWidth: "600px",
					height: "80vh",
					maxHeight: "700px",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				},
			}}
			classNames={{
				overlay: "custom-overlay",
				modal: "custom-modal",
			}}
		>
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
					<p className="text-sm text-muted-foreground mt-1">
						Get AI-powered suggestions and improvements for your resume.
					</p>
				</div>
			</div>

			{/* Chat Content - Always rendered to preserve state */}
			<div className="flex-1 overflow-hidden bg-background">
				<ChatContainer resumeId={resumeId} />
			</div>
		</Modal>
	);
}
export default memo(ChatModal);
