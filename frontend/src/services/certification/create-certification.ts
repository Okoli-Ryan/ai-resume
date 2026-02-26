import FetchClient from "@/lib/fetch";
import { CertificationDto } from "@/types/certification";
import { BulletPointDto } from "@/types/bullet-point";

export type CreateCertificationRequest = {
	resumeId: string;
	certificationName?: string;
	certificateLink?: string;
	dateAttained?: string;
	bulletPoints?: Omit<BulletPointDto, "id" | "activeStatus" | "createdAt" | "updatedAt">[];
};

export const createCertification = async (payload: CreateCertificationRequest) => {
	return FetchClient.post<CertificationDto, CreateCertificationRequest>("/certification", payload);
};
