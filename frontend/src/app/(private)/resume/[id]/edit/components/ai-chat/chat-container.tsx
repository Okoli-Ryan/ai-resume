"use client";

import { TOOL_NAMES } from "@/ai/tools";
import { ChatStatus, isChatLoading } from "@/ai/types";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { memo, useCallback, useMemo } from "react";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { getResumeByIdQuery } from "@/queries/get-resume-by-id-query";
import { useResumeStore } from "@/store/resume-store";

interface ChatContainerProps {
	resumeId: string;
}

const ChatContainer = ({ resumeId }: ChatContainerProps) => {
	const updateResume = useResumeStore((state) => state.update);

	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/chat",
				body: { resumeId },
			}),
		[resumeId]
	);

	const { messages, status, sendMessage } = useChat({
		id: `resume-${resumeId}`,
		transport,
		onToolCall: async ({ toolCall }) => {
			if (toolCall.toolName === TOOL_NAMES.UPDATE_RESUME) {
				try {
					const resume = await getResumeByIdQuery(resumeId);
					updateResume(resume);
				} catch (error) {
					console.error("Failed to refetch resume:", error);
				}
			}
		},
	});

	const isLoading = isChatLoading(status as ChatStatus);

	const onSubmit = useCallback(
		(content: string) => {
			if (content.trim()) {
				sendMessage({
					role: "user",
					parts: [{ type: "text", text: content }],
				});
			}
		},
		[sendMessage]
	);

	return (
		<div className="flex flex-col h-full">
			<ChatMessages messages={messages} status={status as ChatStatus} />
			<ChatInput isLoading={isLoading} onSubmit={onSubmit} resumeId={resumeId} />
		</div>
	);
};

export default memo(ChatContainer);
