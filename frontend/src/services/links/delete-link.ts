import FetchClient from "@/lib/fetch";

export const deleteLink = async (linkId: string) => {
	return FetchClient.delete<boolean>(`/link/${linkId}`);
};
