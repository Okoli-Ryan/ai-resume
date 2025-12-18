import { Document, Page, View } from '@react-pdf/renderer';
import PDFPersonalInfo from './pdf-personal-info';
import PDFSummary from './pdf-summary';
import PDFWorkExperience from './pdf-work-experience';
import PDFEducation from './pdf-education';
import PDFCertifications from './pdf-certifications';
import PDFProjects from './pdf-projects';
import PDFSkills from './pdf-skills';
import { TResume } from '@/types/resume';
import { DEFAULT_RESUME_ORDER } from '@/lib/constants';
import { styles } from './pdf-styles';

type PDFResumeDocumentProps = {
	resume: Partial<TResume>;
};

const PDFResumeDocument = ({ resume }: PDFResumeDocumentProps) => {
	const order = resume.order ? resume.order.split(',') : DEFAULT_RESUME_ORDER;

	const sectionComponents: Record<(typeof DEFAULT_RESUME_ORDER)[number], React.ReactNode> = {
		summary: <PDFSummary resume={resume} key="summary" />,
		workExperience: <PDFWorkExperience resume={resume} key="workExperience" />,
		education: <PDFEducation resume={resume} key="education" />,
		certifications: <PDFCertifications resume={resume} key="certifications" />,
		projects: <PDFProjects resume={resume} key="projects" />,
		skills: <PDFSkills resume={resume} key="skills" />,
	};

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<PDFPersonalInfo resume={resume} />
				<View style={{ marginTop: 12 }}>
					{order.map((sectionKey) => (
						<View key={sectionKey}>
							{sectionComponents[sectionKey as (typeof DEFAULT_RESUME_ORDER)[number]]}
						</View>
					))}
				</View>
			</Page>
		</Document>
	);
};

export default PDFResumeDocument;
