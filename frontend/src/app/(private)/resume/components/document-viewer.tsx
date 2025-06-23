import { PDFViewer } from "@/components/pdf-viewer";
import Education from "@/components/sections/education";
import PersonalInfo from "@/components/sections/personal-info";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Summary from "@/components/sections/summary";
import WorkExperience from "@/components/sections/work-experience";
import { useResumeStore } from "@/store/resume-store";
import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";

const DocumentViewer = () => {
	const resume = useResumeStore((state) => state.resume)!;

	return (
		<PDFViewer className="h-[100dvh] mt-[1.5rem]" width={"100%"} key={Date.now()}>
			<Document>
				<Page size="A4" style={styles.page}>
					<PersonalInfo resume={resume} />
					<View style={styles.sectionContainer}>
						<Summary resume={resume} />
						<WorkExperience resume={resume} />
						<Projects resume={resume} />
						<Skills resume={resume} />
						<Education resume={resume} />
					</View>
				</Page>
			</Document>
		</PDFViewer>
		// <PDFDownloadLink
		// 	key={Date.now()} // Changes every rerender.
		// 	document={<MyDocument />}
		// 	fileName="My lovely PDF">
		// 	Download PDF
		// </PDFDownloadLink>
	);
};

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
		gap: 8,
	},
});

export default DocumentViewer;
