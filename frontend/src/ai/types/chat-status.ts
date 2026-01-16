/**
 * Chat Status Types
 * 
 * Provides type-safe chat status handling and utility functions
 * for determining UI states during AI interactions.
 */

/**
 * Possible chat status values from the useChat hook
 */
export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

/**
 * UI-friendly status categories for displaying appropriate loading indicators
 */
export type ChatUIState = "idle" | "thinking" | "streaming" | "error";

/**
 * Maps chat status to a UI-friendly state for consistent display
 */
export const getChatUIState = (status: ChatStatus): ChatUIState => {
	switch (status) {
		case "submitted":
			return "thinking";
		case "streaming":
			return "streaming";
		case "error":
			return "error";
		case "ready":
		default:
			return "idle";
	}
};

/**
 * Check if the chat is in any loading state (thinking or streaming)
 */
export const isChatLoading = (status: ChatStatus): boolean => {
	return status === "submitted" || status === "streaming";
};

/**
 * Get a human-readable status message for the current state
 */
export const getChatStatusMessage = (status: ChatStatus): string => {
	switch (status) {
		case "submitted":
			return "Thinking...";
		case "streaming":
			return "Responding...";
		case "error":
			return "An error occurred";
		case "ready":
		default:
			return "";
	}
};
