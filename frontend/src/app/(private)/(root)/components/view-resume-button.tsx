import { Eye } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";

const ViewResumeButton = ({ resumeId }: { resumeId: string }) => {
	return (
		<Link href={Routes.editResume(resumeId)}>
			<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
				<Eye className="h-4 w-4" />
				<span className="sr-only">View resume</span>
			</Button>
		</Link>
	);
};

export default ViewResumeButton;
