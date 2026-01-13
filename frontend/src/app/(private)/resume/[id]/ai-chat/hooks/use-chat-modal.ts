"use client";

import { useCallback, useState } from "react";

export const useChatModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const openChat = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeChat = useCallback(() => {
		setIsOpen(false);
	}, []);

	const toggleChat = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	return {
		isOpen,
		openChat,
		closeChat,
		toggleChat,
	};
};
