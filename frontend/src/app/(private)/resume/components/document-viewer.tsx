import { BlobProvider } from "@/components/pdf-viewer";
import Education from "@/components/sections/education";
import PersonalInfo from "@/components/sections/personal-info";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Summary from "@/components/sections/summary";
import WorkExperience from "@/components/sections/work-experience";
import { DEFAULT_RESUME_ORDER } from "@/lib/constants";
import { useResumeStore } from "@/store/resume-store";
import { Document, Font, Page, StyleSheet, View } from "@react-pdf/renderer";

import DownloadModal from "./download-modal";
import PdfCanvasViewer from "./pdf-canvas";

Font.registerHyphenationCallback((word) => [word]);

const MyPDFDocument = () => {
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
		// <PDFViewer className="h-[100dvh] mt-[1.5rem]" width={"100%"} key={Date.now()} showToolbar={false}>
		<Document onRender={({}) => {}}>
			<Page size="A4" style={styles.page}>
				<PersonalInfo resume={resume} />
				<View style={styles.sectionContainer}>
					{order.map((sectionKey) => (
						<View key={sectionKey}>{sectionComponents[sectionKey as (typeof DEFAULT_RESUME_ORDER)[number]]}</View>
					))}
				</View>
			</Page>
		</Document>
		// </PDFViewer>
	);
};

export const MobileDocumentViewer = () => {
	return (
		<BlobProvider document={<MyPDFDocument />}>
			{({ url, loading }) => {
				if (loading || !url) return <p>Loading PDF...</p>;
				return (
					<>
						<DownloadModal url={url} />
						<PdfCanvasViewer url={url} />;
					</>
				);
			}}
		</BlobProvider>
	);
};

export const DocumentViewer = () => (
	<>
		<BlobProvider document={<MyPDFDocument />}>
			{({ url, loading }) => {
				if (loading || !url) return <p>Loading PDF...</p>;
				return (
					<>
						<DownloadModal url={url} />
						<iframe src={url} className="h-[100dvh] mt-[1.5rem]" width={"100%"} height={"100%"} frameBorder="0" scrolling="no"></iframe>
					</>
				);
			}}
		</BlobProvider>
	</>
);

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
		gap: 3,
	},
});

export default DocumentViewer;
