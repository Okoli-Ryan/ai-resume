import FetchClient from "@/lib/fetch";

export const deleteCertification = async (certificationId: string) => {
	return FetchClient.delete<boolean>(`/certification/${certificationId}`);
};
