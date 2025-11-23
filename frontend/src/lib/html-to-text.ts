/**
 * Converts HTML string to plain text by removing all HTML tags
 * Used for PDF generation where we need plain text content
 * @param html - The HTML string to convert
 * @returns Plain text string
 */
export const htmlToText = (html: string): string => {
	if (!html) return '';
	
	// Remove HTML tags
	let text = html.replace(/<[^>]*>/g, '');
	
	// Decode common HTML entities
	text = text
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'");
	
	// Trim and remove excessive whitespace
	text = text.replace(/\s+/g, ' ').trim();
	
	return text;
};
