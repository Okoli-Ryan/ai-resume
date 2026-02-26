import FetchClient from "@/lib/fetch";

export const deleteEducation = async (educationId: string) => {
	return FetchClient.delete<boolean>(`/education/${educationId}`);
};
