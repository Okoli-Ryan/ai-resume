import { jsonToToon } from "@jojojoseph/toon-json-converter";

/**
 * Filters out undefined values from an object
 * @param updates - Object with potential undefined values
 * @returns Object with only defined values
 */
export const filterUpdates = <T extends Record<string, any>>(updates: T): Partial<T> => {
	return Object.fromEntries(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(updates).filter(([_, value]) => value !== undefined)
	) as Partial<T>;
};

/**
 * Checks if there are any fields to update and returns early response if none
 * @param filteredUpdates - Object with filtered updates
 * @returns Success response with updated fields or null if there are updates to process
 */
export const checkForUpdates = (filteredUpdates: Record<string, any>) => {
	if (Object.keys(filteredUpdates).length === 0) {
		return jsonToToon({ success: false, message: "No fields provided to update" });
	}
	return null;
};

/**
 * Creates a successful update response
 * @param filteredUpdates - Object with the updates that were applied
 * @returns Success response with updated field names
 */
export const createUpdateSuccessResponse = (filteredUpdates: Record<string, any>) => {
	return jsonToToon({
		success: true,
		updatedFields: Object.keys(filteredUpdates),
	});
};

/**
 * Validates resume section order string
 * @param order - Comma-separated string of section names
 * @returns true if valid, false otherwise
 */
export const validateResumeOrder = (order: string): boolean => {
	const allowedSections = ["summary", "workExperience", "education", "certifications", "projects", "skills"];
	
	const sections = order
		.split(",")
		.map(section => section.trim())
		.filter(section => section.length > 0);
	
	return sections.every(section => allowedSections.includes(section));
};