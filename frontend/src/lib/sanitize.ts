import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
	if (typeof window === 'undefined') {
		// Server-side: return as-is (will be sanitized on client)
		// In production, consider using a server-safe sanitizer like isomorphic-dompurify
		return html;
	}
	
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a'],
		ALLOWED_ATTR: ['href', 'target', 'rel'],
		ALLOW_DATA_ATTR: false,
	});
};
