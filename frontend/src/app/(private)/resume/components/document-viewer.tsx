"use client";

import PersonalInfo from "@/components/sections/personal-info";
import Summary from "@/components/sections/summary";
import WorkExperience from "@/components/sections/work-experience";
import Education from "@/components/sections/education";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import { DEFAULT_RESUME_ORDER } from "@/lib/constants";
import { useResumeStore } from "@/store/resume-store";
import { useCallback } from "react";
import html2pdf from "html2pdf.js";

import DownloadModal from "./download-modal";

const ResumeDocument = () => {
	const resume = useResumeStore((state) => state.resume);
	
	if (!resume) {
		return (
			<div className="bg-white font-times text-[10px] leading-tight flex items-center justify-center"
				style={{
					width: '210mm',
					minHeight: '297mm',
					padding: '48px 64px 16px 64px',
					margin: '0 auto',
				}}
			>
				<p className="text-base text-gray-500">No resume data available</p>
			</div>
		);
	}
	
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
				boxSizing: 'border-box',
			}}
		>
			<PersonalInfo resume={resume} />
			<div className="flex flex-col gap-[3px]">
				{order.map((sectionKey, index) => (
					<div style={{ marginTop: index === 0 ? 0 : 4 }} key={sectionKey} className="page-break-inside-avoid">
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
	
	const toPDF = useCallback(() => {
		const element = document.querySelector('.resume-document');
		if (!element) return;
		
		const opt = {
			margin: 0,
			filename: filename,
			image: { type: 'jpeg', quality: 1.0 },
			html2canvas: { 
				scale: 4,
				useCORS: true,
				letterRendering: true,
				scrollY: 0,
				scrollX: 0,
				windowWidth: element.scrollWidth,
				windowHeight: element.scrollHeight,
			},
			jsPDF: { 
				unit: 'mm', 
				format: 'a4', 
				orientation: 'portrait',
				compress: false,
			},
			pagebreak: { 
				mode: ['avoid-all', 'css', 'legacy'],
				before: '.page-break-before',
				after: '.page-break-after',
				avoid: '.page-break-inside-avoid'
			}
		};
		
		html2pdf().set(opt).from(element).save();
	}, [filename]);

	return (
		<>
			<DownloadModal toPDF={toPDF} />
			<div className="overflow-auto h-[100dvh] mt-[1.5rem] bg-gray-100">
				<div className="resume-document">
					<ResumeDocument />
				</div>
			</div>
		</>
	);
};

export default DocumentViewer;
