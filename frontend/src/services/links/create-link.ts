import FetchClient from "@/lib/fetch";
import { LinkDto } from "@/types/link";

export type CreateLinkRequest = {
	resumeId: string;
	linkName: string;
	url: string;
};

export const createLink = async (payload: CreateLinkRequest) => {
	return FetchClient.post<LinkDto, CreateLinkRequest>("/link", payload);
};
