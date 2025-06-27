import { Star } from 'lucide-react';

import { auth } from '@/auth';
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { cn, isCustomError } from '@/lib/utils';
import { getMinimalResumesByUserId } from '@/services/resume/get-minimal-resume-list';

import CreateResumeButton from './components/create-resume-button';
import DuplicateResumeButton from './components/duplicate-resume-button';
import ResumeTags from './components/resume-tags';
import ViewResumeButton from './components/view-resume-button';

const Home = async () => {
	const session = await auth();
	const userId = session!.user.id;

	const resumes = await getMinimalResumesByUserId(userId);

	if (isCustomError(resumes)) return <div className="text-red-500">Error loading resumes: {resumes.message}</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Resumes</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{/* <ContinueDraftButton /> */}
				<CreateResumeButton />
			</div>
			<div className="rounded-lg border mt-4">
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
			</div>
		</div>
	);
};

export default Home;
