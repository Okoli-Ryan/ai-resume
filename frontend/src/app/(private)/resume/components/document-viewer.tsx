"use client";

import PersonalInfo from "@/components/sections/personal-info";
import Summary from "@/components/sections/summary";
import WorkExperience from "@/components/sections/work-experience";
import Education from "@/components/sections/education";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import { DEFAULT_RESUME_ORDER } from "@/lib/constants";
import { useResumeStore } from "@/store/resume-store";
import { usePDF } from "react-to-pdf";

import DownloadModal from "./download-modal";

const ResumeDocument = () => {
	const resume = useResumeStore((state) => state.resume)!;
	const order = resume.order ? resume.order.split(",") : DEFAULT_RESUME_ORDER;

	const sectionComponents: Record<(typeof DEFAULT_RESUME_ORDER)[number], React.ReactNode> = {
		summary: <Summary resume={resume} />,
		workExperience: <WorkExperience resume={resume} />,
		education: <Education resume={resume} />,
		projects: <Projects resume={resume} />,
		skills: <Skills resume={resume} />,
	};

	return (
		<div 
			className="bg-white font-times text-[10px] leading-tight"
			style={{
				width: '210mm',
				minHeight: '297mm',
				padding: '48px 64px 16px 64px',
				margin: '0 auto',
			}}
		>
			<PersonalInfo resume={resume} />
			<div className="flex flex-col gap-[3px]">
				{order.map((sectionKey, index) => (
					<div style={{ marginTop: index === 0 ? 0 : 4 }} key={sectionKey}>
						{sectionComponents[sectionKey as (typeof DEFAULT_RESUME_ORDER)[number]]}
					</div>
				))}
			</div>
		</div>
	);
};

export const DocumentViewer = () => {
	const resume = useResumeStore((state) => state.resume);
	const filename = (resume?.resumeName || Date.now()).toString() + ".pdf";
	
	const { targetRef, toPDF } = usePDF({
		filename,
		page: { 
			format: 'A4',
			margin: 0,
		}
	});

	return (
		<>
			<DownloadModal toPDF={toPDF} />
			<div className="overflow-auto h-[100dvh] mt-[1.5rem] bg-gray-100">
				<div ref={targetRef}>
					<ResumeDocument />
				</div>
			</div>
		</>
	);
};

export default DocumentViewer;
