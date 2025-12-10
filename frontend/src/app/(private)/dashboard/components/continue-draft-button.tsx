"use client"
import { ReplyAll } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Routes } from '@/lib/routes';
import { useResumeStore } from '@/store/resume-store';

const ContinueDraftButton = () => {
	const resumeDraft = useResumeStore((state) => state.resumeDraft);
	const updateResume = useResumeStore((state) => state.update);
	const router = useRouter();

	function continueDraft() {
		if (resumeDraft?.id) {
			router.push(Routes.editResume(resumeDraft.id));
		} else {
			updateResume(resumeDraft!);
			router.push(Routes.createResume);
		}
	}

	if (!resumeDraft) return null;

	return (
		<div className="relative group">
			<div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
				<Button onClick={continueDraft} className="bg-white rounded-full mr-2 hover:bg-gray-400 transition-colors duration-300">
					<ReplyAll className="size-6 text-gray-800" />
				</Button>
			</div>
		</div>
	);
};

export default ContinueDraftButton;
