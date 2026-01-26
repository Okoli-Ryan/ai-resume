import FetchClient from "@/lib/fetch";
import { CertificationDto } from "@/types/certification";

export type PatchUpdateCertificationRequest = {
	certificationName?: string;
	certificateLink?: string;
	dateAttained?: string;
};

export const patchUpdateCertification = async (certificationId: string, payload: PatchUpdateCertificationRequest) => {
	return FetchClient.patch<PatchUpdateCertificationRequest, CertificationDto>(`/certification/${certificationId}`, payload);
};
