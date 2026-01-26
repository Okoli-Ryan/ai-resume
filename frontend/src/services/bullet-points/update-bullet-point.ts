import FetchClient from "@/lib/fetch";
import { BulletPointDto } from "@/types/bullet-point";

export type UpdateBulletPointRequest = {
	text: string;
};

export const updateBulletPoint = async (bulletPointId: string, payload: UpdateBulletPointRequest) => {
	return FetchClient.put<UpdateBulletPointRequest, BulletPointDto>(`/bullet-point/${bulletPointId}`, payload);
};
