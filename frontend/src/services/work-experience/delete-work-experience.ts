import FetchClient from "@/lib/fetch";

export const deleteWorkExperience = async (workExperienceId: string) => {
	return FetchClient.delete<boolean>(`/work-experience/${workExperienceId}`);
};
