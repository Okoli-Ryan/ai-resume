"use client";

import PersonalInfo from "@/components/sections/personal-info";
import Summary from "@/components/sections/summary";
import WorkExperience from "@/components/sections/work-experience";
import Education from "@/components/sections/education";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import { DEFAULT_RESUME_ORDER } from "@/lib/constants";
import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pdf } from '@react-pdf/renderer';
import PDFResumeDocument from '@/components/pdf-sections/pdf-resume-document';

import DownloadModal from "./download-modal";

// A4 dimensions and styling constants
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PADDING_TOP_PX = 48;
const PADDING_BOTTOM_PX = 16;
const PADDING_HORIZONTAL_PX = 64;

// Convert mm to pixels at 96 DPI
const MM_TO_PX = 96 / 25.4;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;
const PAGE_CONTENT_HEIGHT = A4_HEIGHT_PX - PADDING_TOP_PX - PADDING_BOTTOM_PX;

interface PageContent {
	elements: React.ReactNode[];
	key: string;
}

// Helper function to get section component
const getSectionComponent = (sectionKey: string, resume: Partial<TResume>) => {
	switch (sectionKey) {
		case 'summary':
			return <Summary resume={resume} />;
		case 'workExperience':
			return <WorkExperience resume={resume} />;
		case 'education':
			return <Education resume={resume} />;
		case 'projects':
			return <Projects resume={resume} />;
		case 'skills':
			return <Skills resume={resume} />;
		default:
			return null;
	}
};

const ResumeDocument = () => {
	const resume = useResumeStore((state) => state.resume);
	const lastUpdated = useResumeStore((state) => state.lastUpdated);
	const measureRef = useRef<HTMLDivElement>(null);
	const [pages, setPages] = useState<PageContent[]>([]);
	const [isCalculating, setIsCalculating] = useState(true);

	const order = useMemo(() => 
		resume?.order ? resume.order.split(",") : DEFAULT_RESUME_ORDER,
		[resume?.order]
	);

	const calculatePagination = useCallback(() => {
		if (!measureRef.current || !resume) return;

		const measureContainer = measureRef.current;
		const children = Array.from(measureContainer.children) as HTMLElement[];
		
		if (children.length === 0) {
			setPages([{ elements: [], key: 'page-0' }]);
			setIsCalculating(false);
			return;
		}

		const newPages: PageContent[] = [];
		let currentPageElements: React.ReactNode[] = [];
		let currentPageHeight = 0;
		let pageIndex = 0;

		// Get personal info height (first child)
		const personalInfoEl = children[0];
		const personalInfoHeight = personalInfoEl ? personalInfoEl.getBoundingClientRect().height : 0;
		currentPageHeight = personalInfoHeight;
		currentPageElements.push(<PersonalInfo key="personal-info" resume={resume} />);

		// Get sections container (second child)
		const sectionsContainer = children[1];
		if (sectionsContainer) {
			const sectionElements = Array.from(sectionsContainer.children) as HTMLElement[];
			
			sectionElements.forEach((sectionEl, index) => {
				const sectionKey = order[index];
				const sectionHeight = sectionEl.getBoundingClientRect().height;
				const marginTop = index === 0 ? 0 : 4;
				const totalHeight = sectionHeight + marginTop;

				// Check if adding this section would exceed page height
				if (currentPageHeight + totalHeight > PAGE_CONTENT_HEIGHT && currentPageElements.length > 0) {
					// Save current page and start new one
					newPages.push({
						elements: [...currentPageElements],
						key: `page-${pageIndex}`,
					});
					pageIndex++;
					currentPageElements = [];
					currentPageHeight = 0;
				}

				// Add section to current page
				currentPageElements.push(
					<div style={{ marginTop: currentPageElements.length === 0 ? 0 : 4 }} key={sectionKey} className="page-break-inside-avoid">
						{getSectionComponent(sectionKey, resume)}
					</div>
				);
				currentPageHeight += totalHeight;
			});
		}

		// Add last page if it has content
		if (currentPageElements.length > 0) {
			newPages.push({
				elements: currentPageElements,
				key: `page-${pageIndex}`,
			});
		}

		setPages(newPages);
		setIsCalculating(false);
	}, [resume, order]);

	// Recalculate pagination on mount and when resume is updated
	useEffect(() => {
		setIsCalculating(true);
		// Use requestAnimationFrame to ensure DOM is ready for measurement
		const timeoutId = setTimeout(() => {
			requestAnimationFrame(() => {
				calculatePagination();
			});
		}, 50);

		return () => clearTimeout(timeoutId);
	}, [lastUpdated, calculatePagination]);
	
	if (!resume) {
		return (
			<div className="page bg-white font-times text-[10px] leading-tight flex items-center justify-center"
				style={{
					width: `${A4_WIDTH_MM}mm`,
					minHeight: `${A4_HEIGHT_MM}mm`,
					padding: `${PADDING_TOP_PX}px ${PADDING_HORIZONTAL_PX}px ${PADDING_BOTTOM_PX}px ${PADDING_HORIZONTAL_PX}px`,
					margin: '0 auto',
				}}
			>
				<p className="text-base text-gray-500">No resume data available</p>
			</div>
		);
	}

	return (
		<>
			{/* Hidden measurement container - used to calculate heights */}
			<div
				ref={measureRef}
				className="font-times text-[10px] leading-tight"
				style={{
					position: 'absolute',
					visibility: 'hidden',
					width: `${A4_WIDTH_MM}mm`,
					padding: `${PADDING_TOP_PX}px ${PADDING_HORIZONTAL_PX}px ${PADDING_BOTTOM_PX}px ${PADDING_HORIZONTAL_PX}px`,
					boxSizing: 'border-box',
				}}
				aria-hidden="true"
			>
				<PersonalInfo resume={resume} />
				<div className="flex flex-col gap-[3px]">
					{order.map((sectionKey, index) => (
						<div style={{ marginTop: index === 0 ? 0 : 4 }} key={sectionKey} className="page-break-inside-avoid">
							{getSectionComponent(sectionKey, resume)}
						</div>
					))}
				</div>
			</div>

			{/* Render pages */}
			<div className="flex flex-col gap-8">
				{!isCalculating && pages.map((page) => (
					<div
						key={page.key}
						className="page bg-white font-times text-[10px] leading-tight"
						style={{
							width: `${A4_WIDTH_MM}mm`,
							minHeight: `${A4_HEIGHT_MM}mm`,
							padding: `${PADDING_TOP_PX}px ${PADDING_HORIZONTAL_PX}px ${PADDING_BOTTOM_PX}px ${PADDING_HORIZONTAL_PX}px`,
							margin: '0 auto',
							boxSizing: 'border-box',
						}}
					>
						{page.elements}
					</div>
				))}
				{isCalculating && (
					<div
						className="page bg-white font-times text-[10px] leading-tight"
						style={{
							width: `${A4_WIDTH_MM}mm`,
							minHeight: `${A4_HEIGHT_MM}mm`,
							padding: `${PADDING_TOP_PX}px ${PADDING_HORIZONTAL_PX}px ${PADDING_BOTTOM_PX}px ${PADDING_HORIZONTAL_PX}px`,
							margin: '0 auto',
							boxSizing: 'border-box',
						}}
					>
						<PersonalInfo resume={resume} />
						<div className="flex flex-col gap-[3px]">
							{order.map((sectionKey, index) => (
								<div style={{ marginTop: index === 0 ? 0 : 4 }} key={sectionKey} className="page-break-inside-avoid">
									{getSectionComponent(sectionKey, resume)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export const DocumentViewer = () => {
	const resume = useResumeStore((state) => state.resume);
	const filename = (resume?.resumeName || Date.now()).toString() + ".pdf";
	
	const toPDF = useCallback(async () => {
		if (!resume) {
			console.error('No resume data available');
			return;
		}
		
		try {
			// Generate PDF using react-pdf/renderer
			const blob = await pdf(<PDFResumeDocument resume={resume} />).toBlob();
			
			// Create download link
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			link.click();
			
			// Clean up
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error generating PDF:', error);
		}
	}, [filename, resume]);

	return (
		<>
			<DownloadModal toPDF={toPDF} />
			<div className="overflow-auto h-[100dvh] mt-[1.5rem] bg-gray-100 py-8">
				<div className="resume-document">
					<ResumeDocument />
				</div>
			</div>
		</>
	);
};

export default DocumentViewer;
