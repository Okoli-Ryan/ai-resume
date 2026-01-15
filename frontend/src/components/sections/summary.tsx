"use client";

import Section from "./section";
import { TResume } from "@/types/resume";
import { sanitizeHtml } from "@/lib/sanitize";

const Summary = ({ resume }: { resume: Partial<TResume> }) => {
	const summary = resume.summary;

	if (!summary || summary === "<p></p>") return null;

	return (
		<div>
			<Section title="Summary">
				<div className="*:!font-times text-[10px] leading-tight" dangerouslySetInnerHTML={{ __html: sanitizeHtml(summary) }} />
			</Section>
		</div>
	);
};

export default Summary;
