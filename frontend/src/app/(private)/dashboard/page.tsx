import { isCustomError } from "@/lib/utils";
import { getMinimalResumes } from "@/services/resume/get-minimal-resume-list";

import DashboardContent from "./components/dashboard-content";

const Home = async () => {
	const resumes = await getMinimalResumes();

	if (isCustomError(resumes)) return <div className="text-red-500">Error loading resumes: {resumes.message}</div>;

	return (
		<div className="w-full px-4 sm:px-6 lg:px-8 py-8 ">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
				<p className="text-gray-600">Manage your resumes and create professional CVs</p>
			</div>
			<DashboardContent initialResumes={resumes} />
		</div>
	);
};

export default Home;
