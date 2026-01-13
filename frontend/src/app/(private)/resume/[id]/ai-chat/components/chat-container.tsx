"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { memo, useCallback, useMemo } from "react";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

interface ChatContainerProps {
	resumeId: string;
}

const ChatContainer = ({ resumeId }: ChatContainerProps) => {
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
	});

	const isLoading = status === "streaming" || status === "submitted";

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
			<ChatMessages messages={messages} isLoading={isLoading} />
			<ChatInput isLoading={isLoading} onSubmit={onSubmit} resumeId={resumeId} />
		</div>
	);
};

export default memo(ChatContainer);
