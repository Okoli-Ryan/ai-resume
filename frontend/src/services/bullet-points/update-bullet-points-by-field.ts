import FetchClient from "@/lib/fetch";
import { BulletPointDto } from "@/types/bullet-point";

export type FieldType = "Education" | "Project" | "WorkExperience";

export type BulletPointTextItem = {
	text: string;
};

export type UpdateBulletPointsByFieldIdRequest = {
	bulletPoints: BulletPointTextItem[];
};

export const updateBulletPointsByFieldId = async (fieldType: FieldType, fieldId: string, payload: UpdateBulletPointsByFieldIdRequest) => {
	return FetchClient.put<UpdateBulletPointsByFieldIdRequest, BulletPointDto[]>(`/bullet-point/${fieldType}/${fieldId}`, payload);
};
