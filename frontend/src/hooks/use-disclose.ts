"use client";

import { useCallback, useState } from "react";

export interface UseDisclosureReturn {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onToggle: () => void;
}

/**
 * A generic hook for managing open/close state of modals, dropdowns, drawers, etc.
 * 
 * @param defaultOpen - Initial open state (defaults to false)
 * @returns Object containing isOpen state and control functions
 * 
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 * 
 * return (
 *   <>
 *     <button onClick={onOpen}>Open Modal</button>
 *     <Modal isOpen={isOpen} onClose={onClose}>Content</Modal>
 *   </>
 * );
 */
export const useDisclose = (defaultOpen = false): UseDisclosureReturn => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const onOpen = useCallback(() => {
		setIsOpen(true);
	}, []);

	const onClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	const onToggle = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	return {
		isOpen,
		onOpen,
		onClose,
		onToggle,
	};
};
