/**
 * Converts HTML string to plain text by removing all HTML tags
 * Used for PDF generation where we need plain text content
 * Note: Input should already be sanitized by DOMPurify before calling this function
 * @param html - The HTML string to convert (pre-sanitized)
 * @returns Plain text string
 */
export const htmlToText = (html: string): string => {
	if (!html) return '';
	
	// Use browser's built-in HTML parser if available (safe for decoding entities)
	if (typeof window !== 'undefined') {
		const doc = new DOMParser().parseFromString(html, 'text/html');
		const text = doc.body.textContent || '';
		// Trim and remove excessive whitespace
		return text.replace(/\s+/g, ' ').trim();
	}
	
	// Server-side fallback: simple tag removal without entity decoding
	// This is safe because the content won't have entities on the server
	let text = html.replace(/<[^>]*>/g, '');
	
	// Trim and remove excessive whitespace
	text = text.replace(/\s+/g, ' ').trim();
	
	return text;
};
