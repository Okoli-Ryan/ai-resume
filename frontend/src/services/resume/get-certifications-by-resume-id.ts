import FetchClient from '@/lib/fetch';
import { CertificationDto } from '@/types/certification';

export const getCertificationsByResumeId = async (resumeId: string) => {
	return FetchClient.get<CertificationDto[]>(`/certification/resume/${resumeId}`);
};
