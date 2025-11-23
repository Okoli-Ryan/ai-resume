import PersonalInfo from "@/components/sections/personal-info";
import Summary from "@/components/sections/summary";
import WorkExperience from "@/components/sections/work-experience";
import { DEFAULT_RESUME_ORDER } from "@/lib/constants";
import { useResumeStore } from "@/store/resume-store";
import { Document, Font, Page, StyleSheet, usePDF, View } from "@react-pdf/renderer";
import { BrowserView, MobileView } from "react-device-detect";

import DownloadModal from "./download-modal";
import PdfCanvasViewer from "./pdf-canvas";

import Education from "@/components/sections/education";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import { useEffect, useMemo } from "react";
import { pdfjs } from "react-pdf";
import { TResume } from "@/types/resume";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

Font.registerHyphenationCallback((word) => [word]);

const MyPDFDocument = ({ resume }: { resume: Partial<TResume> }) => {
	const order = resume.order ? resume.order.split(",") : DEFAULT_RESUME_ORDER;

	const sectionComponents: Record<(typeof DEFAULT_RESUME_ORDER)[number], React.ReactNode> = {
		summary: <Summary resume={resume} />,
		workExperience: <WorkExperience resume={resume} />,
		education: <Education resume={resume} />,
		projects: <Projects resume={resume} />,
		skills: <Skills resume={resume} />,
	};

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<PersonalInfo resume={resume} />
				<View style={styles.sectionContainer}>
					{order.map((sectionKey, index) => (
						<View style={{marginTop: index === 0 ? 0 : 4}} key={sectionKey}>{sectionComponents[sectionKey as (typeof DEFAULT_RESUME_ORDER)[number]]}</View>
					))}
				</View>
			</Page>
		</Document>
	);
};

export const DocumentViewer = () => {
	const resume = useResumeStore((state) => state.resume)!;
	const lastUpdate = useResumeStore((state) => state.lastUpdated);

	// Memoize the document to prevent unnecessary recreations
	// We intentionally include lastUpdate as a dependency even though it's not used in the function.
	// This ensures the document is recreated when the store updates, even if the resume reference doesn't change.
	// This is necessary for nested updates (e.g., adding/updating items in arrays like work experience).
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const document = useMemo(() => <MyPDFDocument resume={resume} />, [resume, lastUpdate]);

	const [instance, update] = usePDF({ document });

	useEffect(() => {
		update(document);
	}, [document, update]);

	if (!instance.url || instance.loading) return <p>Loading PDF...</p>;

	const url = instance.url;

	return (
		<>
			<DownloadModal url={url} />
			<BrowserView>
				<iframe src={url} className="h-[100dvh] mt-[1.5rem]" width={"100%"} height={"100%"} frameBorder="0" scrolling="no"></iframe>
			</BrowserView>
			<MobileView>
				<PdfCanvasViewer url={url} />
			</MobileView>
		</>
	);
};

// <PDFDownloadLink
// 	key={Date.now()} // Changes every rerender.
// 	document={<MyDocument />}
// 	fileName="My lovely PDF">
// 	Download PDF
// </PDFDownloadLink>
const styles = StyleSheet.create({
	page: {
		fontFamily: "Times-Roman",
		fontSize: 10,
		paddingHorizontal: 64,
		paddingTop: 48,
		paddingBottom: 16,
	},

	sectionContainer: {
		display: "flex",
        flexDirection: "column",
		gap: 3,
	},
});

export default DocumentViewer;
