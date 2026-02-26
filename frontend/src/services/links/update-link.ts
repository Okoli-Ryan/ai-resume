import FetchClient from "@/lib/fetch";
import { LinkDto } from "@/types/link";

export type UpdateLinkRequest = {
	linkName: string;
	url: string;
};

export const updateLink = async (linkId: string, payload: UpdateLinkRequest) => {
	return FetchClient.put<UpdateLinkRequest, LinkDto>(`/link/${linkId}`, payload);
};
