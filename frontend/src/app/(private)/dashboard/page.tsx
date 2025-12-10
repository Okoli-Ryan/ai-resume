import { auth } from "@/auth";
import { isCustomError } from "@/lib/utils";
import { getMinimalResumesByUserId } from "@/services/resume/get-minimal-resume-list";

import CreateResumeButton from "./components/create-resume-button";
import ImportResumeButton from "./components/import-resume-button";
import ResumeTable from "./components/resume-table";

const Home = async () => {
	const session = await auth();
	const userId = session!.user.id;

	const resumes = await getMinimalResumesByUserId(userId);

	if (isCustomError(resumes)) return <div className="text-red-500">Error loading resumes: {resumes.message}</div>;

	return (
		<div className="w-full px-4 sm:px-6 lg:px-8 py-8 ">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
				<p className="text-gray-600">Manage your resumes and create professional CVs</p>
			</div>
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				<CreateResumeButton />
				<ImportResumeButton />
			</div>
			<div className="w-full overflow-x-auto">
				<ResumeTable resumes={resumes} isLoading={false} />
			</div>
			{/* <div className="rounded-lg border mt-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead>Date Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{resumes.map((resume) => (
							<TableRow key={resume.id}>
								<TableCell>
									<div className="flex items-center">
										{resume.resumeName}
										<Star fill="yellow" strokeWidth={0} size={14} className={cn("ml-2", { invisible: !resume.isFavourite })} />
									</div>
								</TableCell>
								<TableCell>{resume.role}</TableCell>
								<TableCell>
									<ResumeTags tags={resume.tags} />
								</TableCell>
								<TableCell>{new Date(resume.createdAt!).toLocaleDateString()}</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<ViewResumeButton resumeId={resume.id!} />
										<DuplicateResumeButton resumeId={resume.id!} />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div> */}
		</div>
	);
};

export default Home;
