import FetchClient from '@/lib/fetch';

export const getResumePDF = async (resumeId: string) => {
	return FetchClient.get<Blob>(`/resume/${resumeId}/pdf`, {
		responseFormat: "blob",
		hasCustomResponse: true,
	});
};
