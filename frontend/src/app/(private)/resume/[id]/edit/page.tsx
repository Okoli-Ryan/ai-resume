import { isCustomError } from '@/lib/utils';
import { getResumeById } from '@/services/resume/get-resume-by-id';

import ResumeDoc from '../../components/resume-doc';

const EditResume = async ({ params }: { params: Promise<{ id: string }> }) => {
	const resumeId = (await params).id;

	const resume = await getResumeById(resumeId);

	if (isCustomError(resume)) return <div>Resume not found</div>;

	return <ResumeDoc resume={resume} />;
};

export default EditResume;
