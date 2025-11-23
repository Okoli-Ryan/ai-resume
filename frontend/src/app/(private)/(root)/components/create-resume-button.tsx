"use client";

import { Plus } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { toast } from "sonner";

import { createResumeAction } from "@/app/(private)/(root)/actions/create-resume-action";
import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import { useResumeStore } from "@/store/resume-store";

const CreateResumeButton = () => {
	const clearResume = useResumeStore((state) => state.clear);

	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	function createNew() {
		startTransition(async () => {
			const response = await createResumeAction({});

			if (!response.success) {
				toast.error(response.message);
				return;
			}

			clearResume();
			router.push(Routes.editResume(response.data.id));
		});
	}

	return (
		<label className="cursor-pointer relative">
			<Button
				loading={isPending}
				onClick={createNew}
				className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 shadow-sm">
				<Plus className="w-4 h-4 mr-2" />
				Create Resume
			</Button>
		</label>
	);
};

export default CreateResumeButton;
