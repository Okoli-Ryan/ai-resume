"use client";

import { TOOL_REFETCH_MAP } from "@/ai/tools";
import { ChatStatus, isChatLoading } from "@/ai/types";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { memo, useCallback, useMemo } from "react";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { getResumeById } from "@/queries/use-resume-by-id";
import { useResumeStore } from "@/store/resume-store";

interface ChatContainerProps {
	resumeId: string;
}

const ChatContainer = ({ resumeId }: ChatContainerProps) => {
	const { update } = useResumeStore();

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
		onFinish: async (response) => {
			const toolCalls = response.messages.flatMap((m) => m.parts).filter((p) => p.type.startsWith("tool-"));

			const needsRefetch = toolCalls.some((toolCall) => {
				const toolName = toolCall.type.replace("tool-", "");
				return TOOL_REFETCH_MAP[toolName as keyof typeof TOOL_REFETCH_MAP];
			});

			if (!needsRefetch) return;

			try {
				const updatedResume = await getResumeById(resumeId);
				update(updatedResume);
			} catch {
				// TODO handle error
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
